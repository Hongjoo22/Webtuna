from django.urls import path
from . import views

app_name = 'webtoons'

urlpatterns = [
    path('',views.mainPage),
    path('<int:webtoonId>/detail/',views.webtoonDetail),
    path('<int:webtoonId>/like/',views.webtoonLike),
    path('<int:webtoonId>/rating/',views.webtoonRate),
    path('<int:webtoonId>/log/',views.webtoonLog),
    path('list/<int:pageNum>/',views.webtoonList),
    path('filter/<int:pageNum>/', views.filterWebtoon),
    path('search/<int:pageNum>/',views.searchWebtoon),
    path('search/image/',views.searchImageWebtoon),
    path('recommend/', views.recommendWebtoon),
    path('tag/<int:tagId>/like/',views.tagLike),
    path('tag/get/', views.getTag),
]
