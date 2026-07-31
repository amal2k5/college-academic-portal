import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        print("=== CONSUMER CONNECT ===")
        print(self.scope["user"])
        user = self.scope["user"]

        if user.is_anonymous:
            await self.close()
            return

        from accounts.models import User
        if user.role == User.Role.PLATFORM_ADMIN:
            self.group_name = "platform_admin"
        else:
            self.group_name = f"student_{user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        await self.send(
            text_data=json.dumps(
                {
                    "message": "Connected Successfully",
                    "user": user.email,
                    "group": self.group_name,
                }
            )
        )

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.send(
            text_data=json.dumps(
                {
                    "message": "Message received successfully!",
                    "data": data,
                }
            )
        )

    async def send_notification(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification",
                    "message": event["message"],
                }
            )
        )