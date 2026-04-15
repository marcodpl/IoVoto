import hashlib

from eth_account import Account
from eth_account.messages import encode_defunct
from eth_utils import keccak

from config import PRIVATE_KEY, PUBLIC_ADDRESS


def generate_nullifier(user_secret: str) -> str:
    return hashlib.sha256(user_secret.encode()).hexdigest()


def create_commitment(vote: str, salt: str) -> str:
    data = vote + salt
    return hashlib.sha256(data.encode()).hexdigest()


def sign_commitment(commitment: str) -> str:
    commitment_bytes = bytes.fromhex(commitment)
    message_hash = keccak(commitment_bytes)
    message = encode_defunct(primitive=message_hash)
    signed_message = Account.sign_message(message, PRIVATE_KEY)
    return signed_message.signature.hex()
