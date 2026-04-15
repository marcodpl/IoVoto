from fastapi import FastAPI
from pydantic import BaseModel
import os

from cryptutils import (
    generate_nullifier,
    create_commitment,
    sign_commitment,
    PUBLIC_ADDRESS
)

app = FastAPI()


# 📦 Schema richiesta
class VoteRequest(BaseModel):
    user_secret: str
    vote: str


@app.get("/")
def root():
    return {"status": "AE backend running"}


@app.post("/generate_vote")
def generate_vote(req: VoteRequest):
    # Genera salt casuale
    salt = os.urandom(16).hex()

    # Genera nullifier
    nullifier = generate_nullifier(req.user_secret)

    # Commitment
    commitment = create_commitment(req.vote, salt)

    # Firma
    signature = sign_commitment(commitment)

    return {
        "nullifier": nullifier,
        "commitment": commitment,
        "signature": signature,
        "salt": salt,
        "ae_address": PUBLIC_ADDRESS
    }