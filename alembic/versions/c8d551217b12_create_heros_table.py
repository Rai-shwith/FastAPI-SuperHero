"""create heros table

Revision ID: c8d551217b12
Revises: 
Create Date: 2024-06-06 16:39:02.625987

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8d551217b12'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("heros",sa.Column("id",sa.Integer(),nullable=False,primary_key=True),sa.Column("name",sa.String(),nullable=False))
    pass


def downgrade() -> None:
    op.drop_table("heros")
    pass
