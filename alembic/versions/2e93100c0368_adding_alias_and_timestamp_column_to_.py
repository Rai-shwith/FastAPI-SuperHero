"""adding alias and timestamp column to heros

Revision ID: 2e93100c0368
Revises: 1d54d28817f3
Create Date: 2024-06-07 14:27:19.238497

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2e93100c0368'
down_revision: Union[str, None] = '1d54d28817f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("heros",sa.Column("joined_on",sa.TIMESTAMP(timezone=True),nullable=False,server_default=sa.text("NOW()")))
    pass


def downgrade() -> None:
    op.drop_column("heros","joined_on")
    pass
