"""inserting alias to table heros

Revision ID: c4c78669d4cd
Revises: c8d551217b12
Create Date: 2024-06-06 16:59:18.416917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4c78669d4cd'
down_revision: Union[str, None] = 'c8d551217b12'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("heros",sa.Column("alias",sa.String,nullable=False))
    


def downgrade() -> None:
    op.drop_column("heros","alias")
    pass
