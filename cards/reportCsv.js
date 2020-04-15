
exports.TEXT = `
This is some placeholder text.
A second line of text.
`

exports.MARKDOWN = `
F001

**Tell us about yourself**

We just need a few more details to get you booked for the trip of a lifetime!

Don't worry, we'll never share or sell your information.\n

**Please enter your name**:
`

exports.ACTION = {
    type: 'submit',
    messageId: '',
    inputs:{
        dueDate: '17/02/2020'
    }
}

exports.CARD = JSON.parse(`
[{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "F001",
                                        "size": "Small",
                                        "weight": "Lighter"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 3,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Email CSV Task List",
                                        "size": "Medium",
                                        "weight": "Bolder"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Tell me what you'd like to do with the CSV you uploaded"
            },
            {
                "type": "TextBlock",
                "text": "Registration Report",
                "weight": "Bolder"
            },
            {
                "type": "Input.Toggle",
                "title": "Group Summary",
                "id": "groupSummary",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "Input.Toggle",
                "title": "Domain Summary",
                "id": "domainSummary",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "Input.Toggle",
                "title": "Name List",
                "id": "nameList",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "TextBlock",
                "text": "New emails since previous upload",
                "weight": "Bolder"
            },
            {
                "type": "Input.Toggle",
                "title": "Cvent Invitation Import",
                "id": "inviteDif",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "Input.Toggle",
                "title": "Email BCC List",
                "id": "emailDif",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "Input.Toggle",
                "title": "List to add to Teams",
                "id": "teamsDif",
                "wrap": false,
                "value": "false"
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Submit",
                "data": {
                    "id": "F001"
                }
            }
        ]
    }
}
]`)