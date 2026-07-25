import json

import firebase_admin
from decouple import config
from django.conf import settings
from firebase_admin import credentials, messaging


# Initialize Firebase only once
if not firebase_admin._apps:

    firebase_credentials = config(
        "FIREBASE_CREDENTIALS",
        default=None,
    )

    if firebase_credentials:
        # Production (Render): Load credentials from environment variable
        cred = credentials.Certificate(
            json.loads(firebase_credentials)
        )
    else:
        # Local development: Load credentials from JSON file
        cred = credentials.Certificate(
            settings.FIREBASE_SERVICE_ACCOUNT
        )

    firebase_admin.initialize_app(cred)


def send_to_device(
    token,
    title,
    body,
    data=None,
):
    """
    Send a push notification to a single device.
    """

    try:
        message = messaging.Message(
            token=token,
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
        )

        response = messaging.send(message)

        return {
            "success": True,
            "response": response,
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error),
        }


def send_to_devices(
    tokens,
    title,
    body,
    data=None,
):
    """
    Send the same notification to multiple devices.
    """

    results = []

    for token in tokens:
        results.append(
            send_to_device(
                token=token,
                title=title,
                body=body,
                data=data,
            )
        )

    return results