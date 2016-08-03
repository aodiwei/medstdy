## 部署方法:
1. 安装mysql
sudo apt-get install mysql-server mysql-client libmysqlclient-dev

2. 安装mongodb
sudo apt install mongodb-server mongodb-clients

3. 安装Python依赖
sudo pip install -r requirements.txt

4. 安装js依[此步生成环境可以忽略]
安装npm: sudo apt install npm
在console目录下执行npm install
  
### 运行方法:
**配置参考[config](../config/)**

### 服务列表及运行方式
- User服务:

> python -m user.main

- data服务:

> python -m data.main

后台启动
nohup python -m user.main > /dev/null 2>&1 &

IDE启动
- 如果需要不同端口启动需在edit configure 里配置 script parameters 为 --port=8080 等
