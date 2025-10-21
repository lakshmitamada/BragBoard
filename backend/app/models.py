from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
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


class ShoutOut(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    author = relationship("User", backref="shoutouts")
    tags = relationship("ShoutOutTag", backref="shoutout")
    reactions = relationship("ShoutOutReaction", backref="shoutout")
    comments = relationship("ShoutOutComment", backref="shoutout")


class ShoutOutTag(Base):
    __tablename__ = "shoutout_tags"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("User")


class ShoutOutReaction(Base):
    __tablename__ = "shoutout_reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String(10), nullable=False)

    # Relationships
    user = relationship("User")


class ShoutOutComment(Base):
    __tablename__ = "shoutout_comments"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")
