'''
Created on 2016年2月18日

@author: AilenZou
'''

import tornado.web
from tornado.options import options
import env
from config import ConfigMgr

from .entries import entries
from logs import LoggerMgr

tornado.options.define('port', 
                       default=11000, 
                       help='run server on specific port.', 
                       type=int
                       )

tornado.options.parse_command_line()

env.init()

logger = LoggerMgr.getLogger()


if __name__ == '__main__':
    settings = {
        'cookie_secret': ConfigMgr.get("cookie_secret"),
    }
    
    application = tornado.web.Application(entries, **settings)
    logger.info("Start server at %d", options.port)
    application.listen(options.port)
    try:
        tornado.ioloop.IOLoop.current().start()
    except KeyboardInterrupt:
        logger.debug("CTRL-C occurs")
    finally:
        env.finish()
