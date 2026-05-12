from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AssignmentViewSet, CommitteeTermViewSet, MemberViewSet, PositionViewSet, WingViewSet


router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='committee-members')
router.register(r'terms', CommitteeTermViewSet, basename='committee-terms')
router.register(r'wings', WingViewSet, basename='committee-wings')
router.register(r'positions', PositionViewSet, basename='committee-positions')
router.register(r'assignments', AssignmentViewSet, basename='committee-assignments')


urlpatterns = [
	path('', include(router.urls)),
]