<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
=======
from sqlalchemy import Column, Integer, String, Boolean
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False, default="employee")
    name = Column(String(255))  # ← This matches the DB column
    department = Column(String, nullable=False)

    # 🆕 Added for profile
    joining_date = Column(String, nullable=True)
    current_project = Column(String, nullable=True)
    group_members = Column(String, nullable=True)
    
    skills = Column(String, nullable=True)
    experience = Column(String, nullable=True)


class SecurityKey(Base):
    __tablename__ = "security_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    is_used = Column(Boolean, default=False)




<<<<<<< HEAD
# Shout-out core post
class ShoutOut(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    image_url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# Tagging of recipients (many-to-many via link table)
class ShoutOutTag(Base):
    __tablename__ = "shoutout_tags"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)


# Reactions (emoji or short code)
class ShoutOutReaction(Base):
    __tablename__ = "shoutout_reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    emoji = Column(String(16), nullable=False)  # store emoji or shortcode
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# Comments on shout-outs
class ShoutOutComment(Base):
    __tablename__ = "shoutout_comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

=======
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
