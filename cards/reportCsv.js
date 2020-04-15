
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
                                        "text": "CSV File (with emails)",
                                        "size": "Large",
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
                "text": "Tell me what you'd like to do with the CSV file you uploaded"
            },
            {
                "type": "TextBlock",
                "text": "Registration Report",
                "size": "Medium",
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
                "title": "Name List (for Engage CSV Exports)",
                "id": "nameList",
                "wrap": false,
                "value": "false"
            },
            {
                "type": "TextBlock",
                "text": "Filtered Lists",
                "size": "Medium",
                "weight": "Bolder"
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": 2,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Regex List Filter: "
                            }
                        ],
                        "verticalContentAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Column Name",
                                "size": "Small",
                                "weight": "Lighter"
                            },
                            {
                                "type": "Input.Text",
                                "id": "columnName",
                                "placeholder": "Week 1"
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Row Content",
                                "size": "Small",
                                "weight": "Lighter"
                            },
                            {
                                "type": "Input.Text",
                                "id": "rowContent",
                                "placeholder": "April 9"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": 2,
                        "items": [
                            {
                                "type": "Input.Toggle",
                                "title": "Cvent Invitation Import",
                                "id": "inviteDif",
                                "wrap": false,
                                "value": "false"
                            }
                        ],
                        "verticalContentAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Name Field",
                                "size": "Small",
                                "weight": "Lighter"
                            },
                            {
                                "type": "Input.Text",
                                "id": "nameField",
                                "placeholder": "Full Name"
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Email Field",
                                "size": "Small",
                                "weight": "Lighter"
                            },
                            {
                                "type": "Input.Text",
                                "id": "emailField",
                                "placeholder": "email"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "Input.Toggle",
                "title": "Email BCC List",
                "id": "emailDif",
                "wrap": false,
                "value": "false",
                "color": "grey"
            },
            {
                "type": "Input.Toggle",
                "title": "List to add to Teams",
                "id": "teamsDif",
                "wrap": false,
                "value": "false",
                "color": "grey"
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