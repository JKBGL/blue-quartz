from decouple import config

PORT = config('PORT', default=8000, cast=int)
HOST = config('HOST', default='127.0.0.1')
MAX_ROOMS = config('MAX_ROOMS', default=10, cast=int)
VERSION = '0.5.0b'

