"""creating Table for Users

Revision ID: 85dedd89bec0
Revises: c4c78669d4cd
Create Date: 2024-06-06 17:11:33.409011

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '85dedd89bec0'
down_revision: Union[str, None] = 'c4c78669d4cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("users",sa.Column("id",sa.Integer,nullable=False),
                    sa.Column("email",sa.String,nullable=False),
                    sa.Column("created_at",sa.TIMESTAMP(timezone=True),
                              server_default=sa.text("now()"),nullable=False),
                              sa.PrimaryKeyConstraint("id"),
                              sa.UniqueConstraint("email")
                              )


def downgrade() -> None:
    op.drop_table("users")

