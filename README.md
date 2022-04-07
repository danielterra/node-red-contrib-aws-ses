# A simple node that send e-mails with AWS Simple Email Service.

## Pre-requisites
1. You need to have a account on AWS and create a programatic access user on IAM with permission to send e-mail with AWS Simple Email Service.
2. You need to follow the steps to configure the SES with a verified domain to send emails.

## Configure the node
Double click the node and fill all fields

## Payload
It expects a payload with these properties;

- payload.recipient: Email address(es) to sendo to, should be valid. Accept either one address as a string or multiple addresses as an array of strings.
- payload.cc_recipient: Optional email address(es) to sendo to as carbon-copy (Cc), should be valid. Accept either one address as a string or multiple addresses as an array of strings.
- payload.bcc_recipient: Optional email address(es) to sendo to as blind-carbon-copy (Bcc), should be valid. Accept either one address as a string or multiple addresses as an array of strings.
- payload.subject: The email subject, should be short string.
- payload.body_text: If you want to send a pure text email you should use this property.
- payload.body_html: The html string to send.

## Return
It returns an Object with the Id of the email sended

```
{
    "ResponseMetadata":{
        "RequestId":"d05b47cf-0ee2-413f-b06b-fe981fbfed1b"
    },
    "MessageId":"0101017599fe549f-64676c3d-8dda-478b-9765-228d49de341c-000000"
}
```
