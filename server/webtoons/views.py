from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Member_View_Webtoons, Member

from .serializers import WebtoonSerializer, RatingSerializer, WebtoonListSerializer, SearchWebtoonSerializer, TagSerializer
from webtoons.models import Webtoon, Genre, Tag
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator
from django.db.models import Q

from accounts.models import Member_View_Webtoons
from webtoons.models import Webtoon, Genre, Tag
from .serializers import WebtoonSerializer, RatingSerializer, WebtoonListSerializer, SearchWebtoonSerializer, TagSerializer

import random
import requests
from datetime import datetime

# 메인 페이지
@api_view(['GET'])
def mainPage(request):
    webtoon1 = Webtoon.objects.filter(image_type1__gte = 90).order_by('-rating')[:5]
    webtoon2 = Webtoon.objects.filter(image_type2__gte = 90).order_by('-rating')[:5]
    webtoon3 = Webtoon.objects.filter(image_type3__gte = 90).order_by('-rating')[:5]
    webtoon4 = Webtoon.objects.filter(image_type4__gte = 90).order_by('-rating')[:5]
    webtoon5 = Webtoon.objects.filter(image_type5__gte = 90).order_by('-rating')[:5]
    webtoon6 = Webtoon.objects.filter(image_type6__gte = 90).order_by('-rating')[:5]

    webtoon_1 = WebtoonListSerializer(webtoon1, many = True)
    webtoon_2 = WebtoonListSerializer(webtoon2, many = True)
    webtoon_3 = WebtoonListSerializer(webtoon3, many = True)
    webtoon_4 = WebtoonListSerializer(webtoon4, many = True)
    webtoon_5 = WebtoonListSerializer(webtoon5, many = True)
    webtoon_6 = WebtoonListSerializer(webtoon6, many = True)

    return Response({'0': webtoon_5.data, '1':webtoon_2.data, '2':webtoon_3.data, '3':webtoon_4.data, '4':webtoon_1.data, '5':webtoon_6.data})


# 웹툰 상세 페이지
@api_view(['GET'])
def webtoonDetail(request,webtoonId):
    webtoon = get_object_or_404(Webtoon, pk=int(webtoonId))
    flag = 0

    if webtoon.webtoon_ratings.filter(user_id = request.user.pk).exists():
        flag = 1

    author_webtoon_list = []
    now_authors = []
    authors = webtoon.authors.all()
    
    for author in authors:
        now_authors.append(author.author_id)

    now_webtoons = Webtoon.objects.filter(authors__in = now_authors)

    for now_webtoon in now_webtoons:
        if now_webtoon not in author_webtoon_list and now_webtoon.title != webtoon.title:
            author_webtoon_list.append(now_webtoon)

    author_webtoons = WebtoonListSerializer(author_webtoon_list, many= True)

    # similar웹툰 없을 때 예외처리
    if not len(webtoon.similar_webtoons):
        sample_list = []
    else:
        similar_webtoon_id_list = list(map(int, webtoon.similar_webtoons.split(',')))
        sample_list = random.sample(similar_webtoon_id_list, 4)
    
    similar_webtoon_list = Webtoon.objects.filter(webtoon_id__in = sample_list)

    similar_webtoon = WebtoonListSerializer(similar_webtoon_list, many= True)

    webtoon.view_count += 1
    webtoon.save()

    webtoon_info = WebtoonSerializer(webtoon)

    # 성별, 나이대
    users = webtoon.liked_webtoon_users.all()
    gender_age = dict()

    for user in users:
        user_age = datetime.now().year - (user.birth//10000) +1
        if user_age >= 90:
            user_age = 90
        age_key = str(user_age // 10) + '0' + user.gender 

        try:
            gender_age[age_key] += 1
        except:
            gender_age[age_key] = 1

    sort_gender = sorted(gender_age.items(), key=lambda x:x[1], reverse=True)
    gender_age = []
    if len(sort_gender) >= 5:
        for i in range(5):
            gender_age.append((sort_gender[i][0], sort_gender[i][1]))
    else:
        for i in range(len(sort_gender)):
            gender_age.append((sort_gender[i][0], sort_gender[i][1]))
    
    return Response({'data':webtoon_info.data, 'is_rated':flag, 'author_webtoons':author_webtoons.data, 'similar_webtoon': similar_webtoon.data, 'gender_age':gender_age}, status.HTTP_200_OK)



page_cut = 20
# 전체 웹툰 리스트 보기
@api_view(['GET'])
def webtoonList(request,pageNum):
    webtoon_list = Webtoon.objects.order_by('title')
    paginator = Paginator(webtoon_list, page_cut)
    webtoons = paginator.get_page(int(pageNum))
    webtoons_list = WebtoonListSerializer(webtoons, many = True)
    return Response(webtoons_list.data, status.HTTP_200_OK)


# 태그 가져오기
@api_view(['GET'])
def getTag(request):
    tags = Tag.objects.all()
    tags_list = TagSerializer(tags, many = True)

    return Response(tags_list.data, status.HTTP_200_OK)


# 웹툰 검색 기능
@api_view(['GET'])
def searchWebtoon(request,pageNum):
    webtoon_list = []
    
    keyword = request.GET['keyword'].rstrip().lstrip()
    if(keyword != ""):
        search_list = Webtoon.objects.filter(title=keyword).order_by('title')
        for toon in search_list:
            if(toon not in webtoon_list):
                webtoon_list.append(toon)
        search_list = Webtoon.objects.filter(title__icontains=keyword).order_by('title')
        for toon in search_list:
            if(toon not in webtoon_list):
                webtoon_list.append(toon)
        search_list = Webtoon.objects.filter(authors__name=keyword).order_by('title')
        for toon in search_list:
            if(toon not in webtoon_list):
                webtoon_list.append(toon)
        search_list = Webtoon.objects.filter(authors__name__icontains=keyword).order_by('title')
        for toon in search_list:
            if(toon not in webtoon_list):
                webtoon_list.append(toon)
            
    # webtoon_list = list(set(webtoon_list))
    # webtoon_list.sort(key=lambda webtoon: webtoon.title, reverse=False)
    paginator = Paginator(webtoon_list, page_cut)
    webtoons = paginator.get_page(int(pageNum))
    
    webtoons_list = WebtoonListSerializer(webtoons, many = True)
    return Response(webtoons_list.data, status.HTTP_200_OK)


# 웹툰 필터링
@api_view(['POST'])
def filterWebtoon(request, pageNum):
    platform_list = request.data['platform']
    day_list = request.data['day']
    genre_list = request.data['genre']
    tag_list = request.data['tag']
    
    # 필터에 아무것도 안들어올 때 예외처리
    if not len(platform_list):
        platform_list = list(range(1, 4))
        
    if not len(day_list):
        day_list = list(range(1, 9))
        
    if not len(genre_list):
        genre_list = list(range(1, 16))
        
    if len(tag_list):
        webtoon_list = Webtoon.objects.filter(
            Q(platforms__in = platform_list) &
            Q(days__in = day_list) &
            Q(genres__in = genre_list) &
            Q(tags__in = tag_list)
        ).distinct().order_by('title')
        
    else:
        webtoon_list = Webtoon.objects.filter(
            Q(platforms__in = platform_list) &
            Q(days__in = day_list) &
            Q(genres__in = genre_list)
        ).distinct().order_by('title')
    
    
    paginator = Paginator(webtoon_list, page_cut)
    webtoons = paginator.get_page(int(pageNum))
    
    webtoons_list = WebtoonListSerializer(webtoons, many = True)
    return Response(webtoons_list.data, status.HTTP_200_OK)


# 웹툰 찜하기
@api_view(['POST'])
def webtoonLike(request, webtoonId):
    webtoon = get_object_or_404(Webtoon, pk=int(webtoonId))
    if webtoon.liked_webtoon_users.filter(id = request.user.pk).exists():
        webtoon.liked_webtoon_users.remove(request.user.pk)
    
        return Response({'data': False})
    else:
        webtoon.liked_webtoon_users.add(request.user.pk)
        return Response({'data': True})


# 태그 좋아요 남기기
@api_view(['POST'])
def tagLike(request, tagId):
    tag = get_object_or_404(Tag, pk=int(tagId))

    if tag.tag_users.filter(id = request.user.pk).exists():
        tag.tag_users.remove(request.user.pk)
    
        return Response({'data': False})
    else:
        tag.tag_users.add(request.user.pk)
        return Response({'data': True})


# 웹툰 평점 남기기
@api_view(['POST'])
def webtoonRate(request, webtoonId):
    webtoon = get_object_or_404(Webtoon, pk=int(webtoonId))
    serializer = RatingSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save(webtoon=webtoon, user=request.user)

        ratings = webtoon.webtoon_ratings.all()
        num = 0

        for rating in ratings:
            num += rating.rating

        rating_num = round(num/len(ratings), 2)
        webtoon.rating = rating_num
        webtoon.save()

        webtoons_info = WebtoonSerializer(webtoon)
        return Response(webtoons_info.data, status.HTTP_200_OK)


# 웹툰 로그 남기기
@api_view(['POST'])
def webtoonLog(request, webtoonId):
    if Member_View_Webtoons.objects.filter(member_id=request.user.id, webtoon_id=webtoonId).exists():
        Member_View_Webtoons.objects.filter(
            member_id = request.user.id,
            webtoon_id = webtoonId 
        ).delete()
        
        Member_View_Webtoons.objects.create(
            member_id = request.user.id,
            webtoon_id = webtoonId 
        )
        return Response({'data': True})
    
    else:
        Member_View_Webtoons.objects.create(
            member_id = request.user.id,
            webtoon_id = webtoonId 
        )

    return Response({'data': True})


# 추천 종합
@api_view(['GET'])
def recommendWebtoon(request):
    user_id = int(request.user.pk)
    user = get_object_or_404(Member, pk = request.user.pk)
    user_nickname = user.nickname
    
    # CF 기반 추천
    cf_recommend =  cfRecommend(user_id)
    
    # 선호 그림체 기반 추천
    draw_recommend = drawRecommend(user_id)
    
    # 날씨 기반 추천
    weather_recommend = weatherRecommend(user_id)
    
    # 유저가 좋아하는 장르 기반 추천
    genre_recommend = genreRecommend(user_id)
    
    # 유저가 좋아하는 태그 기반 추천
    tag_recommend = tagRecommend(user_id)

    # 유저 나이대, 성별 기준 찜목록 인기순 추천
    users_popularity_recommend = popularity_recommend(user_id)
    
    return Response({'0': cf_recommend, '1': draw_recommend, '2': genre_recommend, '3': tag_recommend, '4':users_popularity_recommend, '5': weather_recommend}, status.HTTP_200_OK)


# 이미지 검색
@api_view(['POST'])
def searchImageWebtoon(request):
    orginal = request.data['probability']

    webtoons = Webtoon.objects.all()
    min_diff = 1000

    for webtoon in webtoons:
        diff = 0
        
        if webtoon.image_type1 is not None:
            diff += abs(orginal[0] - webtoon.image_type1)
            diff += abs(orginal[1] - webtoon.image_type2)
            diff += abs(orginal[2] - webtoon.image_type3)
            diff += abs(orginal[3] - webtoon.image_type4)
            diff += abs(orginal[4] - webtoon.image_type5)
            diff += abs(orginal[5] - webtoon.image_type6)

            if min_diff > diff:
                min_diff = diff
                min_webtoon = webtoon
    
    search_webtoons = SearchWebtoonSerializer(min_webtoon)

    return Response(search_webtoons.data, status.HTTP_200_OK)


# CF(Collaborate Filtering) 추천
def cfRecommend(user):
    member_nickname = Member.objects.get(pk=user).nickname
    like_webtoons = Webtoon.objects.filter(liked_webtoon_users = user)
    
    user_list = []
    
    for my_webtoon in like_webtoons:
        now_users = my_webtoon.liked_webtoon_users.all()
        
        for now_user in now_users:
            if now_user not in user_list and now_user.id != user:
                user_list.append(now_user)
                
    reco_lst = set()
    for webtoon_like_user in user_list:
        now_webtoons = Webtoon.objects.filter(liked_webtoon_users = webtoon_like_user.id)
        
        for now_webtoon in now_webtoons:
            if now_webtoon not in like_webtoons:
                reco_lst.add(now_webtoon)
                
    reco_lst = list(reco_lst)
    reco_lst.sort(key=lambda x : -x.rating)
    reco_lst = reco_lst[:20]  

    if len(reco_lst) < 10:

        webtoons = Webtoon.objects.all().order_by('-rating')[:100]
        
        while len(reco_lst) < 10:
            webtoon = random.choice(webtoons)
            if webtoon not in reco_lst:
                if webtoon not in like_webtoons:
                    reco_lst.append(webtoon)
    
    msg = f"'{member_nickname}'님의 취향에 맞는 웹툰"
    webtoons_list = WebtoonListSerializer(reco_lst, many=True)
    send_data = [webtoons_list.data,msg]
    
    return send_data


# 날씨 기반 추천
def weatherRecommend(user):
    member = get_object_or_404(get_user_model(), id=user)
    like_webtoons = member.liked_webtoons.all()

    url = 'http://api.openweathermap.org/data/2.5/weather?lat=37.501317&lon=127.039646&appid=7e625d2f562b1014869529981bd7ee18'
    # request the API data and convert the JSON to Python data types
    city_weather = requests.get(url).json()
    # 필요한 정보들만 가져오기

    weather = {
        'main': city_weather['weather'][0]['main'],
        'temperature': city_weather['main']['temp'],
        'description': city_weather['weather'][0]['description'],
        'icon': city_weather['weather'][0]['icon']
    }
    
    sunny = ['clear sky', 'few clouds']
    clouds = ['overcast clouds', 'broken clouds', 'scattered clouds']
    rain = ['drizzle', 'rain', 'light rain', 'moderate rain']
    powerRain = ['shower rain', 'thunderstorm']
    snow = ['snow']
    
    # 로맨스, 판타지, 드라마, 스릴러, 일상, 액션, 무협/사극, 스포츠, 개그, 감성, 소년, BL
    # 일단 딕셔너리로 날씨에 장르들 하나씩을 선택 하도록 함(더 좋은 방법 있으면 그걸로 구현)
    lst = {'clear sky': '로맨스', 'few clouds': '개그', 'overcast clouds': '무협/사극', 'drizzle': '소년', 'rain': '스릴러', 'light rain': '스포츠', 'moderate rain': '개그','shower rain': '판타지', 'thunderstorm': '액션',
           'snow': '드라마', 'broken clouds': '감성', 'scattered clouds': '일상'}
    
    if weather['description'] not in lst:
        genre = random.choice(['에피소드', '스토리', '옴니버스'])
    else:
        genre = lst[weather['description']]
    
    # 장르와 같은 영화 정보들 가지고오기
    genre_data = Genre.objects.get(genre_type = genre)
    webtoon_lst = genre_data.genre_webtoons.all().order_by('-rating')
    real_cnt = 0
    reco_lst = set()

    if len(webtoon_lst) >= 200:
        while len(reco_lst) < 15:
            webtoon = random.choice(webtoon_lst[:100])
            if webtoon not in like_webtoons:
                reco_lst.add(webtoon)
                
            real_cnt += 1
            if real_cnt >= 50:
                break
        
        real_cnt = 0        
        while len(reco_lst) < 20:
            webtoon = random.choice(webtoon_lst[100:])
            if webtoon not in like_webtoons:
                reco_lst.add(webtoon)
            
            real_cnt += 1
            if real_cnt >= 50:
                break
    
    else:
        while len(reco_lst) < 20:
            webtoon = random.choice(list(webtoon_lst))
            if webtoon not in like_webtoons:
                reco_lst.add(webtoon)
                
            real_cnt += 1
            if real_cnt >= 50:
                break
    
    reco_lst = list(reco_lst)
    reco_lst = sorted(reco_lst, key = lambda x: -x.rating)
    
    webtoons_list = WebtoonListSerializer(reco_lst, many=True)
    
    if weather['description'] in sunny:
        msg = '맑은 날 어울리는 웹툰'
    elif weather['description'] in clouds:
        msg = '흐린 날 어울리는 웹툰'
    elif weather['description'] in rain:
        msg = '비오는 날 어울리는 웹툰'
    elif weather['description'] in powerRain:
        msg = '폭우내리는 날 어울리는 웹툰'
    elif weather['description'] in snow:
        msg = '눈 내리는 날 어울리는 웹툰'
    else:
        msg = '오늘 같은 날 어울리는 웹툰'
    
    send_data = [webtoons_list.data, msg]

    return send_data


# 유저가 좋아하는 장르 기반 추천
def genreRecommend(user):
    member = get_object_or_404(get_user_model(), id=user)
    like_webtoons = member.liked_webtoons.all()
    webtoons_length = len(like_webtoons)
    
    genre_types = {
        '로맨스':0,
        '판타지':0,
        '드라마':0,
        '스릴러':0,
        '일상':0,
        '액션':0,
        '무협/사극':0,
        '스포츠':0,
        '개그':0,
        '감성':0,
        '소년':0,
        'BL':0
    }
    
    if webtoons_length == 0:
        reco_lst = []
        msg = ""
        webtoons_list = WebtoonListSerializer(reco_lst, many=True)
        send_data = [webtoons_list.data, msg]
        
        return send_data
    
    else:
        for webtoon in like_webtoons:
            genres = webtoon.genres.all()
            for genre in genres:
                genre_type = genre.genre_type
                if genre_type not in ['스토리','옴니버스','에피소드']:
                    genre_types[genre_type] += 1
                    
    sort_genre = sorted(genre_types.items(), key=lambda x:x[1], reverse=True)
    genre_list = []
    for i in range(3):
        genre_list.append(sort_genre[i][0])
    choice_lst = []
    
    for genre in genre_list:
        genre_data = Genre.objects.get(genre_type = genre)
        webtoon_lst = genre_data.genre_webtoons.all().order_by('-rating')
        choice_lst += random.sample(list(webtoon_lst[:100]), 10)
        
    reco_lst = set()
    for choice in choice_lst:
        if choice not in like_webtoons:
            reco_lst.add(choice)
            
    reco_lst = list(reco_lst)
    reco_lst = sorted(reco_lst, key = lambda x: -x.rating)
    reco_lst = reco_lst[:20]
        
    msg = f"'{member.nickname}'님이 좋아하는 장르의 웹툰"
    webtoons_list = WebtoonListSerializer(reco_lst, many=True)
    send_data = [webtoons_list.data, msg]

    return send_data


# 유저가 좋아하는 태그 기반 추천
def tagRecommend(user):
    member = get_object_or_404(get_user_model(), id=user)
    like_webtoons = member.liked_webtoons.all()
    like_tags = member.tags.all()
    
    # 찜한 태그가 3개 미만일 때 빈 리스트 반환
    if len(like_tags) < 3:
        reco_lst = []
        msg = ""
        webtoons_list = WebtoonListSerializer(reco_lst, many=True)
        send_data = [webtoons_list.data, msg]
        
        return send_data

    reco_lst = set()
    tag_lst = {}
    
    while len(reco_lst) < 20:
        tag = random.choice(list(like_tags))
        tag_data = Tag.objects.get(name = tag.name)
        tag_webtoons = tag_data.tag_webtoons.all()
        cnt = 0
        
        for _ in range(5):
            webtoon = random.choice(list(tag_webtoons))
            if webtoon not in like_webtoons:
                reco_lst.add(webtoon)
                cnt += 1
        
        try:
            tag_lst[tag.name] += cnt
        except:
            tag_lst[tag.name] = cnt
    
    sort_tag = sorted(tag_lst.items(), key=lambda x:x[1], reverse=True)
    tag_lst = []
    for i in range(3):
        tag_lst.append(sort_tag[i][0])
                
    reco_lst = list(reco_lst)
    reco_lst = sorted(reco_lst, key = lambda x: -x.rating)
    reco_lst = reco_lst[:20]
        
    msg = f"'{member.nickname}'님이 좋아하는 태그의 웹툰"
    webtoons_list = WebtoonListSerializer(reco_lst, many=True)
    send_data = [webtoons_list.data, msg]

    return send_data


# 유저가 좋아하는 그림체 기반 추천
def drawRecommend(user):
    member = get_object_or_404(get_user_model(), id=user)
    like_webtoons = member.liked_webtoons.all()
    image_types = {f'draw_type{i}':0 for i in range(1, 31)}

    if len(like_webtoons):

        for webtoon in like_webtoons:
            # 같은 타입애들을 불러오기
            classify_list = webtoon.draw_classifies.all()

            # 그림체 분류 id로 불러오기
            classify_id_list = []
            for classify in classify_list:
                classify_id_list.append(classify.classify_id)
            
            for classify_id in classify_id_list:
                image_types[f'draw_type{classify_id}'] += 1
    
    else:
        webtoons = member.liked_thumbnail.split(",")

        for webtoon_id in webtoons:
            # 같은 타입애들을 불러오기
            webtoon = Webtoon.objects.get(webtoon_id = webtoon_id)
            classify_list = webtoon.draw_classifies.all()

            # 그림체 분류 id로 불러오기
            classify_id_list = []
            for classify in classify_list:
                classify_id_list.append(classify.classify_id)
            
            for classify_id in classify_id_list:
                image_types[f'draw_type{classify_id}'] += 1
    
    sort_image_types = sorted(image_types.items(), key=lambda x:x[1], reverse=True)

    # 선호 그림체 타입 top3 id 저장
    like_image_type_id_list = []
    for like_image_type in sort_image_types[:3]:
        like_image_type_id_list.append(like_image_type[0].split('_')[1][4:])

    like_image_webtoon_list = Webtoon.objects.filter(draw_classifies__in = like_image_type_id_list).distinct().order_by('-rating')
    
    # 중복 웹툰 빼기
    choice_lst = []
    for like_image_webtoon in like_image_webtoon_list:
        if like_image_webtoon not in like_webtoons:
            choice_lst.append(like_image_webtoon)

    reco_lst = choice_lst[:15] + random.sample(choice_lst[15:], 5)

    msg = f"'{member.nickname}'님이 좋아하는 그림체의 웹툰"
    webtoons_list = WebtoonListSerializer(reco_lst, many=True)
    send_data = [webtoons_list.data, msg]

    return send_data


# 내 성별, 나이대 찜목록 기반 추천
def popularity_recommend(user):
    now_year = datetime.today().year
    member = get_object_or_404(get_user_model(), id=user)
    my_liked_list = member.liked_webtoons.all()
    
    # 내 성별
    members = Member.objects.filter(gender=member.gender)
    # 내 나이대
    my_age = now_year- int(str(member.birth)[0:4])+1
    my_age_area = my_age-my_age%10
    my_ages_members = members.filter(birth__lte=((now_year-my_age_area)*10000+1231), birth__gt=(now_year-(my_age_area+10))*10000)

    recommend_liked_list = []
    for mem in my_ages_members:
        if mem.id == user:
            continue
        mem_liked_list = mem.liked_webtoons.all()
        for mem_webtoon in mem_liked_list:
            if mem_webtoon not in my_liked_list:
                recommend_liked_list.append(mem_webtoon.webtoon_id)
    
    recommend_dictionary = {}
    for recommend in recommend_liked_list:
        if str(recommend) in recommend_dictionary.keys() :
            recommend_dictionary[str(recommend)] += 1
        else:
            recommend_dictionary[str(recommend)] = 1
    
    sorted_webtoon_ids = sorted(recommend_dictionary.items(), key=lambda x:x[1], reverse=True)
    webtoon_ids = []
    for id in sorted_webtoon_ids:
        webtoon_ids.append(id[0])
   
    recommend_liked_webtoon = Webtoon.objects.filter(webtoon_id__in = webtoon_ids[:20]).order_by('-rating').order_by('-view_count')
    recommend_view_list = []
    # log기록 maxcount 기준 rating~조회수
    if(len(recommend_liked_webtoon)<20):
        for mem in my_ages_members:
            mem_view_list = Member_View_Webtoons.objects.filter(member_id=mem.id)
            for mem_webtoon in mem_view_list:
                if mem_webtoon.webtoon not in my_liked_list and mem_webtoon.webtoon not in recommend_liked_webtoon:
                    recommend_view_list.append(mem_webtoon.webtoon.webtoon_id)
    
    recommend_dictionary = {}
    for recommend in recommend_view_list:
        if str(recommend) in recommend_dictionary.keys() :
            recommend_dictionary[str(recommend)] += 1
        else:
            recommend_dictionary[str(recommend)] = 1
    
    sorted_webtoon_ids = sorted(recommend_dictionary.items(), key=lambda x:x[1], reverse=True)
   
    webtoon_ids = []
    for id in sorted_webtoon_ids:
        webtoon_ids.append(id[0])
    recommend_views_webtoon = Webtoon.objects.filter(webtoon_id__in = webtoon_ids[:20]).order_by('-rating').order_by('-view_count')
    recommend_list = recommend_liked_webtoon.union(recommend_views_webtoon)[:20]
    
    if member.gender == 'M':
        if my_age_area == 0:
            msg = f"10세미만 남자에게 인기있는 웹툰"
        elif my_age_area >= 90:
            msg = f"90세이상 남자에게 인기있는 웹툰"
        else:
            msg = f"{my_age_area}대 남자에게 인기있는 웹툰"
    else:
        if my_age_area == 0:
            msg = f"10세미만 여자에게 인기있는 웹툰"
        elif my_age_area >= 90:
            msg = f"90세이상 여자에게 인기있는 웹툰"
        else:
            msg = f"{my_age_area}대 여자에게 인기있는 웹툰"
        
    webtoons_list = WebtoonListSerializer(recommend_list, many=True)
    send_data = [webtoons_list.data, msg]

    return send_data
