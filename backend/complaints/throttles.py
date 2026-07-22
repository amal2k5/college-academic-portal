from rest_framework.throttling import AnonRateThrottle


class ComplaintSubmissionThrottle(AnonRateThrottle):
    """
    Limits anonymous complaint submissions.

    Maximum:
        5 requests per hour per IP address.
    """

    scope = "complaint_submission"

    def get_cache_key(self, request, view):
        """
        Use the client's IP address as the throttle key.
        """

        if request.user and request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            "scope": self.scope,
            "ident": ident,
        }