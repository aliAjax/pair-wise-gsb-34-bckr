class DomainError(Exception):
    """业务规则校验失败，code 对应 constants/error_codes 中的错误码。"""

    def __init__(self, code: str):
        super().__init__(code)
        self.code = code
