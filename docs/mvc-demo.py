# Quick Pseudocode Demo for MVC Architecture
from datetime import datetime

class userController: # Controller
    def register(res, req):
        # who use model?
        user = User("fan shen-yu", "leetcode1121")
        if not user.login():
            return 401

        return {"code": 201}
    
    def login(res, req):
        # who use model?
        user = User("fan shen-yu", "leetcode1121")
        if not user.login():
            return {"code": 401}

        return {"code": 200, "token": "fake-jwt-token"}

    def logout(res, req):
        # who use model?
        user = User("fan shen-yu", "leetcode1121")
        user.logout()

        return {"code": 200}
    
class privateChatController:
    def getPrivateMessate(usernameA, usernameB):
        pass
    
    def savePrivateMessage(sender, receiver, text):
        timestamp = datetime.now()
        user = User(sender)
        user.verify()
        user = User(receiver)
        user.verify()
        
        chatroom = Chatroom(sender, receiver)
        if chatroom.save_message(text): # wrap w/ try catch for better error handling
            return {"code": 400, "message": "save failed"}
        
        ...
        return {"code": 201, "message": "hello world"}
        
    def notifyUser(username):
        user = User(username)
        user.notify()
        return {"code": 200}

class User: # Model
    def __init__(self, username, password):
        self.username = username
        self.password = password
    
    def login(self):
        found = db.get("selece where usename=%s & password= %s", self.username, self.password)
        # generate token; login
        return found
    
    def logout(self):
        # clean socket; logout
        return
    
    def notify(self):
        # notify user by socket
        return

class Message: # Model
    def __init__(self, sender, receiver, text):
        self.sender = sender
        self.receiver = receiver
        self.text = text
    
    def get_message(self, sender, receiver):
        found = db.get("selece where sender=%s & receiver= %s", sender, receiver)
        return found

    def save_message(self):
        # DB save msg
        pass

class Chatroom: # Model
    def __init__(self, sender, receiver):
        self.sender = sender
        self.receiver = receiver
    
    def get_all_message(self):
        found = db.get("selece where sender=%s & receiver= %s", self.sender, self.receiver)
        return found

    def save_message(self, text):
        # DB save msg
        message = Message(self.sender, self.receiver, text)
        message.save_message()