# Sliding Window Limiter

class SlidingWindowLimiter:
    def __init__(self, rate_limit: int, time_window: int):
        self.rate_limit = rate_limit
        self.time_window = time_window
        self.requests = []

    def is_allowed(self):
        current_time = time.time()
        self.requests = [req for req in self.requests if req > current_time - self.time_window]
        if len(self.requests) < self.rate_limit:
            self.requests.append(current_time)
            return True
        return False
