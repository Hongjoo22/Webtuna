from django.shortcuts import render
from rest_framework import generics
from webtoons.models import Genre

from webtoons.serializers import WebtoonListSerializer, WebtoonLuckySerializer 
from .serializers import *
from .models import *
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import random


# Create your views here.

# 회원가입
class UserCreate(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSignupSerializer


# 비밀번호 수정하기
@api_view(['PUT'])
def ProfileUpdate(request):
    member = get_object_or_404(get_user_model(), id=request.user.id)
    new_password = request.data['password']
    member.set_password(new_password)
    member.save()
    return Response(True)


# 프로필 이미지 수정하기
@api_view(['PUT'])
def ProfileImage(request):
    member = get_object_or_404(get_user_model(), id=request.user.id)
    profile_image_id = request.data['profile_image_id']
    member.profile_image_id = profile_image_id
    member.save()
    return Response(True)

    
# 프로필 정보 받기
@api_view(['GET'])
def Profile(request):
    member = get_object_or_404(get_user_model(), id=request.user.id)
    webtoons = member.liked_webtoons.all()
    webtoons_length = len(webtoons)
    image_types = {
        'image_type1':0,
        'image_type2':0,
        'image_type3':0,
        'image_type4':0,
        'image_type5':0,
        'image_type6':0
    }
    
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

    if webtoons_length:
        for webtoon in webtoons:
            image_types['image_type1'] += webtoon.image_type1
            image_types['image_type2'] += webtoon.image_type2
            image_types['image_type3'] += webtoon.image_type3
            image_types['image_type4'] += webtoon.image_type4
            image_types['image_type5'] += webtoon.image_type5
            image_types['image_type6'] += webtoon.image_type6
            genres = webtoon.genres.all()
            for genre in genres:
                genre_type = genre.genre_type
                if genre_type not in ['스토리','옴니버스','에피소드']:
                    genre_types[genre_type] += 1
    
    else:
        webtoons = member.liked_thumbnail.split(",")
        webtoons_length = len(webtoons)
        for i in webtoons:
            webtoon = Webtoon.objects.get(webtoon_id=i)
            image_types['image_type1'] += webtoon.image_type1
            image_types['image_type2'] += webtoon.image_type2
            image_types['image_type3'] += webtoon.image_type3
            image_types['image_type4'] += webtoon.image_type4
            image_types['image_type5'] += webtoon.image_type5
            image_types['image_type6'] += webtoon.image_type6
            
    
    for i in range(1,7):
        image_types[f'image_type{i}'] = round(image_types[f'image_type{i}'] / webtoons_length , 2)
    
    sort_genre = sorted(genre_types.items(), key=lambda x:x[1], reverse=True)
    genre_list = {}
    for i in range(3):
        if sort_genre[i][1]:
            genre_list[sort_genre[i][0]] = sort_genre[i][1]
    
        
    serializer = ProfileSerializer(member)
    return Response({'data':serializer.data, 'image_type':image_types, 'genre_list':genre_list}, status.HTTP_200_OK)


# 오늘의 운세
def giveLucky():

    lucky_sample = [
        '오후에 좋은 일이 있습니다.', '이 고비를 잘 넘겨야 합니다.', '대접을 받는 날입니다.', 
        '소고기로 체력 보충하자.', '할까 말까 할 때는 해보자!', '결과는 기대 이상입니다.',
        '좋은 소식이 찾아옵니다.', '식복이 가득합니다.', '하던 일에 결실이 보이네요!',
        '뭐든 잘 풀리니 행복합니다.', '좋은 자세로 임해야합니다.', '결정과 선택은 서두르지 마세요',
        '감정에 휘말리시면 안돼요.', '의욕이 넘치네요.', '본인을 믿으세요.', '오늘도 해피엔딩.',
        '참으면 반드시 득이 돼요.', '결속력이 돈독해집니다.', '들뜨고, 기분이 좋네요!',
        '미뤄왔던 계획을 실행하세요.', '예상치 못한 잔업이 있습니다.'    
    ]
    
    lucky_list = random.choice(lucky_sample)

    return lucky_list


# 메인 프로필 정보 받기
@api_view(['GET'])
def MainProfile(request):
    member = get_object_or_404(get_user_model(), id=request.user.id)
    webtoon = []
    if member.is_today is None:
        webtoon.append(random.choice(list(Webtoon.objects.all())))
        lucky = giveLucky()
    
    elif member.is_today.date() != datetime.now().date():
        webtoon.append(random.choice(list(Webtoon.objects.all())))
        lucky = giveLucky()

    else:
        webtoon = []
        lucky = ""
        
    webtoon_data = WebtoonLuckySerializer(webtoon, many=True)
    serializer = ProfileMainSerializer(member)
    return Response({'user':serializer.data, 'lucky_webtoon': webtoon_data.data, 'lucky':lucky}, status.HTTP_200_OK)


# 이메일 중복 체크하기
@api_view(['POST'])
def EmailCheck(request):
    user_email = request.data['email']
    if user_email == '':
        return Response(False)
    
    if Member.objects.filter(email=user_email).exists():
        return Response(False)

    return Response(True)
    

# 닉네임 중복 체크하기
@api_view(['POST'])
def NicknameCheck(request):
    user_nickname = request.data['nickname']
    if user_nickname == '':
        return Response(False)
                        
    if Member.objects.filter(nickname=user_nickname).exists():
        return Response(False)

    return Response(True)


# 회원 수정페이지 비밀번호 확인
@api_view(['POST'])
def PasswordCheck(request):
    user_password = request.data['password']
    member = get_object_or_404(get_user_model(), id=request.user.id)
    
    if not member.check_password(user_password) :
        return Response(False)
    
    return Response(True)


# @api_view(['GET'])
# def TestUser(request):
#     Webtoon
    
#     return Response(True)
