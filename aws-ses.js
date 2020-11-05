/**
 * Copyright 2020 Daniel Terra.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

const AWS = require("aws-sdk");


module.exports = function(RED) {
    function AwsSESNode(config) {
        function sendError(err, node, done) {
            node.warn(err.message);
    
            if (err) {
                if (done) {
                    // Node-RED 1.0 compatible
                    done(err);
                } else {
                    // Node-RED 0.x compatible
                    node.error(err, msg);
                }
            }
        }

        RED.nodes.createNode(this,config);
        const node = this;
        node.on('input', function(msg, send, done) {
            const charset = "UTF-8";
            const aws_access_key_id = this.credentials.aws_access_key_id;
            const aws_secret_access_key = this.credentials.aws_secret_access_key;
            const region = this.credentials.region;
            const sender = config.sender;

            
            AWS.config.update({
                accessKeyId: aws_access_key_id,
                secretAccessKey: aws_secret_access_key,
                region: region
            });
            
            if (!AWS) {
                sendError(new Error("You must configure the node key and secret before using..."),node,done);
                node.warn("Missing AWS credentials");
                return;
            }

            if (!sender) {
                sendError(new Error("You must configure the node key and secret before using..."),node,done);
                return;
            }

            if (!msg.payload) {
                sendError(new Error("Did you forget to send the payload?"),node,done);
                return;
            }

            if (!msg.payload.recipient) {
                sendError(new Error("msg.payload.recipient is required"),node,done);
                return;
            }

            if (!msg.payload.subject) {
                sendError(new Error("msg.payload.subject is required"),node,done);
                return;
            }

            if (!msg.payload.body_html && !msg.payload.body_text) {
                sendError(new Error("You must provide a msg.payload.body_html or msg.payload.body_text"),node,done);
                return;
            }

            this.status({fill:"blue",shape:"dot",text:"sending..."});
            
            // ITS ALL GOOD MAN, SEND EMAIL!
            
            const params = {
                Source: sender, 
                Destination: { 
                    ToAddresses: [
                        msg.payload.recipient
                    ],
                },
                Message: {
                    Subject: {
                        Data: msg.payload.subject,
                        Charset: charset
                    },
                    Body: {}
                }
            };
            
            if (msg.payload.body_text) {
                params.Message.Body.Text = {
                    Charset: charset,
                    Data: msg.payload.body_text
                };
            }
            
            if (msg.payload.body_html) {
                params.Message.Body.Html = {
                    Charset: charset,
                    Data: msg.payload.body_html
                };
            }
            
            send = send || function() { node.send.apply(node,arguments) }
            
            var ses = new AWS.SES();
            ses.sendEmail(params, (function(err, data) {
                if(err) {
                    sendError(err,node,done);
                } else {
                    this.status({fill:"green",shape:"dot",text:"sent"});
                    msg.payload = data;
                    send(msg);
                    if (done) {
                        done();
                    }
                }
            }).bind(this));
            
        });
    }
    RED.nodes.registerType("aws-ses",AwsSESNode, {
        credentials: {
            aws_access_key_id: {type:"text"},
            aws_secret_access_key: {type:"password"},
            region: {type:"text"}
        }
    });
}