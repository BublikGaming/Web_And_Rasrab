from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "password"]

    def validate_password(self, value: str) -> str:
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен быть минимум 8 символов")
        return value

    def validate_email(self, value: str) -> str:
        if "@" not in value:
            raise serializers.ValidationError("Email должен содержать символ @")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

