# coding: utf-8

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.externals import joblib
import jieba

from logs import LoggerMgr, CustomMgrError
log = LoggerMgr.getLogger()

class SvmLm(object):
    """
    SVM 机器学习
    """
    def predict(self, text):
        """

        :param text:
        :return:
        """
        try:
            clf = joblib.load('data/mlearn/model/svm_model.pkl')
            vocabulary = joblib.load('data/mlearn/model/vocabulary.pkl')
            tfidf_v = TfidfVectorizer(tokenizer=self.word_tokenizer, stop_words=self.stopwords(), vocabulary=vocabulary)
            x = tfidf_v.fit_transform([text]).toarray()
            y = clf.predict(x)
        except Exception, e:
            log.exception("predict {} failed".format(text))
            raise CustomMgrError(e.message)
        return y[0] if y else ""

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
        with open("data/mlearn/model/stopword.txt", 'r') as f:
            stopwords = set([w.strip() for w in f])

        return stopwords


# ml = SvmLm()
# res = ml.predict("自觉双侧面下部宽大，影响美观3年余")
# print res

