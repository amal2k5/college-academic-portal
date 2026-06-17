from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend:

    def authenticate(
        self,
        request,
        email=None,
        password=None,
        **kwargs
    ):
        print("EMAIL RECEIVED:", email)
        print("PASSWORD RECEIVED:", password)

        try:
            user = User.objects.get(email=email)

            print("USER FOUND:", user.email)
            print("ACTIVE:", user.is_active)

            if user.check_password(password):
                print("PASSWORD MATCHED")
                return user

            print("PASSWORD NOT MATCHED")

        except User.DoesNotExist:
            print("USER DOES NOT EXIST")

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)

        except User.DoesNotExist:
            return None