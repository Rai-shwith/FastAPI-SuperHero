"""add foreign-key to heros table

Revision ID: 1d54d28817f3
Revises: 85dedd89bec0
Create Date: 2024-06-07 14:08:36.102319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d54d28817f3'
down_revision: Union[str, None] = '85dedd89bec0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("heros",sa.Column("owner_id",sa.Integer,nullable=False))
    op.create_foreign_key("post_users_fk",source_table="heros",referent_table="users",local_cols=["owner_id"],remote_cols=["id"],ondelete="CASCADE")
    pass


def downgrade() -> None:
    op.drop_constraint("post_users_fk","heros")
    op.drop_column("heros","owner_id")
    pass
