#!/usr/bin/env python
# coding:utf-8
"""
__title__ = ''
__author__ = 'David Ao'
__mtime__ = '2017/1/21'
# 
"""
import json

import jieba
import numpy as np
from sklearn.feature_extraction.text import HashingVectorizer, TfidfVectorizer, CountVectorizer, TfidfTransformer
from sklearn.cross_validation import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.grid_search import GridSearchCV
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

CSV_PATH = r"F:\17MedPro\workspace\medstdy\api\python\data\features_20170121_014219.csv"
STOPWORD_PATH = "stopword.txt"
FEATURES = 1000
VECTORIZER = "TFIDF"  # HASH


class TextClassifier:
    def __init__(self, csv_path=CSV_PATH, stopword_path=STOPWORD_PATH, features=FEATURES, vect=VECTORIZER):
        self.csv_path = csv_path
        self.stopword_path = stopword_path
        self.features = features
        self.vect = vect

    def read_data_from_csv(self, path):
        """
        从csv文件里读取数据
        :param path:
        :return:
        """
        lines = np.loadtxt(path, delimiter=',', dtype='str', skiprows=1)
        return lines

    def word_tokenizer(self, word):
        """
        分词器
        :return:
        """
        return jieba.cut(word, cut_all=True)

    def stopwords(self):
        """
        停词
        :param path:
        :return:
        """
        with open(self.stopword_path, 'r') as f:
            stopwords = set([w.strip() for w in f])

        return stopwords

    def vectorize(self, words):
        """
        转化文本为矩阵
        :param words:
        :return:
        """
        if self.vect == "TFIDF":
            vect_data = self.tfidf_vectorize(words)
        elif self.vect == "HASH":
            vect_data = self.hash_vectorize(words)
        else:
            raise TypeError("nonsupport")

        return vect_data

    def hash_vectorize(self, words):
        """
        转化文本为矩阵
        :param words:
        :return:
        """
        stopwords = self.stopwords()
        v = HashingVectorizer(tokenizer=self.word_tokenizer, stop_words=stopwords, n_features=self.features,
                              non_negative=True)
        words_data = v.fit_transform(words).toarray()
        return words_data

    def tfidf_vectorize(self, words):
        """
        转化文本为矩阵
        :param words:
        :return:
        """
        stopwords = self.stopwords()
        tfidf_v = TfidfVectorizer(tokenizer=self.word_tokenizer, stop_words=stopwords)
        tfidf_words_data = tfidf_v.fit_transform(words).toarray()
        return tfidf_words_data

    def make_data(self, tran_index=1, label_index=-1):
        """
        生成数据
        :param label_index:
        :param tran_index:
        :return:
        """
        X_data = []
        y_data = []
        data_lines = self.read_data_from_csv(self.csv_path)
        label_dict = {}
        label_int = 0
        for line in data_lines:
            if isinstance(tran_index, (list, tuple)):
                tran_text = ""
                for index in tran_index:
                    tran_text += line[index]
                X_data.append(tran_text)
            else:
                X_data.append(line[tran_index])
            y_data.append(line[label_index])
            # if line[label_index] not in label_dict:
            #     label_dict[line[label_index]] = label_int
            #     label_int += 1
            # y_data.append(label_dict[line[label_index]])

        X_data = self.vectorize(X_data)

        # with open("label.txt", "w") as f:
        #     json.dump(label_dict, f)
        X_tran, X_test, y_tran, y_test = train_test_split(np.asarray(X_data), np.asarray(y_data), test_size=0.25)
        return X_tran, X_test, y_tran, y_test

    def svm_text_classifier(self, tran_index=1, label_index=-1):
        """
        svm 分类
        :param label_index:
        :param tran_index:
        :return:
        """
        X_tran, X_test, y_tran, y_test = self.make_data(tran_index=tran_index, label_index=label_index)
        param_grid = {
            "C": [1e3, 5e3, 1e4, 5e5, 1e5],
            "gamma": [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.1],
        }
        clf = GridSearchCV(SVC(kernel="linear"), param_grid=param_grid)
        clf = clf.fit(X_tran, y_tran)

        # train
        clf.fit(X_tran, y_tran)
        y_pred = clf.predict(X_test)

        print("=" * 20 + "svm classifier" + "=" * 20)
        print(classification_report(y_test, y_pred))
        print(confusion_matrix(y_test, y_pred))

    def bayes_text_classifier(self, tran_index=1, label_index=-1):
        """
        bayes
        :param label_index:
        :param tran_index:
        :return:
        """
        X_tran, X_test, y_tran, y_test = self.make_data(tran_index=tran_index, label_index=label_index)
        clf = MultinomialNB(alpha=0.01)
        # train
        clf.fit(X_tran, y_tran)
        y_pred = clf.predict(X_test)

        print("=" * 20 + "bayes classifier" + "=" * 20)
        print(classification_report(y_test, y_pred))
        print(confusion_matrix(y_test, y_pred))


if __name__ == "__main__":
    textClassifier = TextClassifier(features=3000)
    textClassifier.svm_text_classifier()
    # textClassifier.bayes_text_classifier()
