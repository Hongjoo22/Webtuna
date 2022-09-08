import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tuntun.settings")

import django
django.setup()

import urllib
import requests
import json
from webtoons.models import Author, Webtoon, Genre, Day
from bs4 import BeautifulSoup

# #이미지 저장
# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/all'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# i = 0
# for webtoon in webtoons_popular:
#     urllib.request.urlretrieve(webtoon['img'], f"kakaopage{i}.png")
#     i += 1


# if __name__ == '__main__':
    # Base_URL = 'https://korea-webtoon-api.herokuapp.com'
    # path = '/kakao/week'


    # response = requests.get(Base_URL+path)
    # webtoons_popular = response.json()
    
    
    # # 카카오 태그 크롤링
    # headers = {'User-Agent':'mozilla/5.0'}
    # data = requests.get('https://gateway-kw.kakao.com/decorator/v1/decorator/contents/1369/profile', headers=headers)
    # print(data.json()['data']['seoKeywords'])


    # # 카카오 줄거리 크롤링
    # soup = BeautifulSoup(data.text, 'html.parser')
    # description = soup.select_one('head > meta:nth-child(4)')['content']
    

    # # 카카오 장르 크롤링
    # kakao_genre = set()
    # genre_change = {
    #     '학원': '일상',
    #     '무협': '무협/사극',
    #     '코믹': '개그',
    # }
    # for webtoon in webtoons_popular:
    #     try:
    #         webtoon_url = webtoon['url']
    #         headers = {'User-Agent':'mozilla/5.0'}
    #         data = requests.get(f'{webtoon_url}', headers=headers)
    #         soup = BeautifulSoup(data.text, 'html.parser')
    #         genres = soup.select_one('#root > main > div > div > div > div.h-full.overflow-hidden.w-full.z-1.fixed.inset-0.bg-dark-background > div.w-full.left-0.top-0.relative > div.content-main-wrapper.opacity-0.invisible.relative.current-content-main.opacity-100.\!visible.z-1 > div.pb-20.pt-96.relative.z-1 > div.relative.mx-auto.my-0.w-full.lg\:w-default-max-width > div.mx-20.flex.justify-between.relative.z-1.pointer-events-auto.pt-12 > div > div > p.whitespace-pre-wrap.break-all.break-words.support-break-word.s12-regular-white.ml-3.opacity-85').text
    #         if genres == '공포/스릴러':
    #             genres = '스릴러'
    #             kakao_genre.add(genres)
    #         elif genres.find('/') != -1:
    #             genres = genres.split('/')
    #             for genre in genres:
    #                 if genre in ['학원', '무협', '코믹']:
    #                     kakao_genre.add(genre_change[f'{genre}'])
    #                 else:
    #                     kakao_genre.add(genre)
    #         else:
    #             genres = genres.split()
    #             for genre in genres:
    #                 kakao_genre.add(genre)
    #     except:
    #         pass
    # print(kakao_genre)
    #{'로맨스', '공포/스릴러', '학원/판타지', '로맨스 판타지', '드라마', '액션/무협', '판타지 드라마', '코믹/일상'}
    
    

    # # author 데이터 넣기
    # authors = set()
    # for webtoon in webtoons_popular:
    #     if webtoon['author'].find(","):
    #         for name in webtoon['author'].split(","):
    #             authors.add(name.replace("\n","").replace("\t",""))
    #     else:
    #         authors.add(webtoon['author'].replace("\n","").replace("\t",""))

    # for author in authors:
    #     if Author.objects.filter(name = author).exists():
    #         pass
    #     else:
    #         Author.objects.create(
    #             name = author
    #         )


# # genre 데이터 넣기

# genres = ["감성","개그","드라마","로맨스","무협/사극","스릴러","스포츠","액션","일상","판타지","스토리","에피소드","옴니버스"]

# for genre in genres:
#     genre_create = Genre.objects.create(
#         genre_type = genre
#     )




# if __name__ == '__main__':
#     for j in range(45, 60):
#         Base_URL = 'https://korea-webtoon-api.herokuapp.com'
#         path = '/naver/week'
#         params = {
#             'api_key' : 'e73cf3371bb27a97420ed90450a7bbce',
#             'language' : 'ko-KR',
#             'page' : j,
#         }

#         response = requests.get(Base_URL+path, params = params)
#         movie_popular = response.json()

#         for movie in movie_popular['results']:
#             movie_title = movie['title']
#             movie_releasedate = movie['release_date']
#             movie_voteaverage = movie['vote_average']
#             movie_votecount = movie['vote_count']
#             movie_posterpath = movie['poster_path']
#             movie_popularity = int(movie['popularity']*1000)
#             movie_id = movie['id']
#             movie_overview = movie['overview']
#             movie_genre = movie['genre_ids']

#             path=f'/movie/{movie_id}'
#             params = {
#             'api_key' : 'e73cf3371bb27a97420ed90450a7bbce',
#             'language' : 'ko-KR',
#             }
#             response2 = requests.get(Base_URL+path, params = params)
#             movie_detail = response2.json()
#             movie_runtime = movie_detail['runtime']

#             movie = Movie.objects.create(
#                 title = movie_title,
#                 release_date = movie_releasedate,
#                 popularity = movie_popularity,
#                 vote_count = movie_votecount,
#                 vote_average = movie_voteaverage,
#                 overview = movie_overview,
#                 poster_path = movie_posterpath,
#                 runtime = movie_runtime,
#             )
#             for i in movie_genre:
#                 movie.genres.add(i)

# movie = Movie.objects.all()[96]

# title = movie.title
# params = {
#     'key': 'AIzaSyA0ZPLyvp_6Eas5z78e0M9mJXEAxOSsBog',
#     'part': 'snippet',
#     'q': title + ' official trailer',
#     'type': 'video',
#     'maxResults': '1'
# }
# URL = "https://www.googleapis.com/youtube/v3/search"
# response = requests.get(URL, params=params)
# src = 'https://www.youtube.com/embed/' + \
#     json.loads(response.text)['items'][0]['id']['videoId']
# data = {
#     'src': src+'?autoplay=1&mute=0&enablejsapi=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0'
# }
# movie.src = data['src']
# movie.save()


# m = 15814
# C = 6.6366635249764325

# if __name__ == '__main__':
#     for j in range(1, 100):
#         Base_URL = 'https://api.themoviedb.org/3'
#         path = '/movie/popular'
#         params = {
#             'api_key' : 'e73cf3371bb27a97420ed90450a7bbce',
#             'language' : 'ko-KR',
#             'page' : j,
#         }

#         response = requests.get(Base_URL+path, params = params)
#         movie_popular = response.json()

#         for movie in movie_popular['results']:
#             movie_title = movie['title']
#             new_movie = Movie.objects.filter(title=movie_title)
#             movie_original_title = movie['original_title']
#             for i in new_movie:
#                 i.original_title = movie_original_title
#                 i.save()

# m = 15814
# C = 6.6366635249764325
# movies = Movie.objects.all()
# for movie in movies:
#     v = movie.vote_count
#     R = movie.vote_average
#     ans = ((v/(v+m))*R) + ((m/(v+m))*C)
#     movie.wr = ans
#     movie.save()