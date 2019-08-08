from django.urls import path

from apps.index_app.views import index

urlpatterns = [
    path('', view=index, name='index'),
    path('index/', view=index, name='index'),
]
