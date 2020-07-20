class ChatEngine{ //class to send connection request
    constructor(chatBoxId, userEmail){
        
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //this.socket = io.connect('http://3.17.138.207:5000'); //For deployment
        this.socket = io.connect('http://localhost:5000'); //For local machine

        if(this.userEmail){ //checking for user email and calling connection Handler
            this.connectionHandler();
        }
    }

    connectionHandler(){ // 2way connection b/w server and observer, once the request is recieved by server
        let self = this;

        this.socket.on('connect', function(){
            console.log("socket connection established!");

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'codeial',
            });

            self.socket.on('user_joined', function(data){
                console.log("A user joined", data);
            });
        });

        // Sending the message with the click of send button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        //Recieving the message on the frontend
        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}