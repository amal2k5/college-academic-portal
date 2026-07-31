import json
import firebase_admin
from decouple import config
from django.conf import settings
from firebase_admin import credentials, messaging




if not firebase_admin._apps:

    firebase_credentials = config(
        "FIREBASE_CREDENTIALS",
        default=None,
    )

    if firebase_credentials:

        cred = credentials.Certificate(
            json.loads(firebase_credentials)
        )
    else:

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