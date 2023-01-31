import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tuntun.settings")

import django
django.setup()

import json
import urllib
import requests
import json
from webtoons.models import Author, Platform, Webtoon, Genre, Day, Tag
from bs4 import BeautifulSoup
import statistics

# webtoon 데이터가공-Naver API : http://localhost:8000/webtoons/naver/week
# Author -> Genre -> Tag -> Webtoon 순으로
# @api_view(['GET'])
# def webtoonsResponse(request,platfrom,type):
#     url = 'https://korea-webtoon-api.herokuapp.com/'   
#     params = platfrom + "/" +type
#     webtoons = requests.get(url+params).json()
#     # print(webtoons)
#     webtoon_list = []
#     for webtoon in webtoons:
#         webtoon_list.append(webtoon['title'])
#         if(Webtoon.objects.filter(title=webtoon['title']).exists()):
#             continue
#         my_author_list = []
#         my_genre_list = []

#         insert_authors = []
#         insert_genres = []
#         insert_tags = []
#         insert_days = []
#         insert_platforms = []

#         platform = webtoon['service']
#         if(Platform.objects.filter(name=platform).exists()):
#             pass
#         else:
#             Platform.objects.create(name=platform)
#         insert_platforms.append(Platform.objects.get(name=platform))

#         if(webtoon['author'].find(",")):
#             for name in webtoon['author'].split(","):
#                 my_author_list.append(name.replace("\n","").replace("\t",""))
#         else:
#             my_author_list.append(webtoon['author'].replace("\n","").replace("\t",""))

#         # Author insert
#         for author in my_author_list:
#             if(Author.objects.filter(name=author).exists()):
#                 pass
#             else:
#                 Author.objects.create(name = author)
#             insert_authors.append(Author.objects.get(name=author))

#         page_url = webtoon['url'].replace("m.","")
#         headers = {'User-Agent':'mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/101.0.4951.67 safari/537.36'}
#         data = requests.get(page_url, headers=headers)
#         soup = BeautifulSoup(data.text, 'html.parser')
#         genres = soup.select_one('#content > div.comicinfo > div.detail > p.detail_info > span.genre').get_text()
#         summary = soup.select_one('#content > div.comicinfo > div.detail > p:nth-child(2)').get_text()
       
#         if(genres.find(",")!=-1):
#             for genre in genres.split(","):
#                 genre_type = genre.replace(" ","")
#                 my_genre_list.append(genre_type)
        

#         # Genre insert
#         for genre in my_genre_list:
#             if(Genre.objects.filter(genre_type=genre).exists()):
#                 pass
#             else:
#                 Genre.objects.create(genre_type = genre)
#             insert_genres.append(Genre.objects.get(genre_type=genre))

#         # tag 얻기위한 페이지로 이동
#         page_url = page_url.replace("&weekday","&no=1&weekday").replace("list","detail")
#         data = requests.get(page_url, headers=headers)
#         soup = BeautifulSoup(data.text, 'html.parser')

#         #Tag Insert
#         for i in range(1,21):
#             tag = soup.select_one(f'#comic_view_area > div.view_sub > div.tag > a:nth-child({i})')
#             if tag == None:
#                 break
#             tagName = tag.get_text().replace(",","").replace(" ","")
#             if(Tag.objects.filter(name=tagName).exists()):
#                 pass
#             else:
#                 Tag.objects.create(name=tagName)
#             insert_tags.append(Tag.objects.get(name=tagName))
#         # Day insert
#         week = { 0: "Mon", 1: "Tue", 2: "Wed", 3:"Thu",4:"Fri",5:"Sat",6:"Sun", 7: "Fin"}
#         for i in webtoon['week']:
#             insert_days.append(Day.objects.get(name=week[i]))
        
#         # DB에 webtoon 데이터 삽입
#         toon = Webtoon.objects.create(
#             title=webtoon['title'], 
#             summary = summary, 
#             thumbnail=webtoon['img'],
#             page=webtoon['url'].replace("m.",""),
#             adult=webtoon['additional']['adult'])

#         for i in insert_genres:
#             toon.genres.add(i)
#         for i in insert_authors:
#             toon.authors.add(i)
#         for i in insert_tags:
#             toon.tags.add(i)
#         # day도 추가
#         for i in insert_days:
#             toon.days.add(i)
#         for i in insert_platforms:
#             toon.platforms.add(i)


#     # C부터 경로 탐색하기 때문에 위치선정 잘해야함 (Csv 활용 코드-안씀)
#     # with open('C:/Users/user/Documents/tuntun/tuntun/webtoons/naver.csv', mode='r', encoding='ANSI') as webtoon_lists:
#     #     reader = csv.reader(webtoon_lists)
#          # author
#     #     for data in reader:
#     #         # print(data)
#     #         # if(data[2].find("/")!=-1):
#     #         #     for str in data[2].split("/"):
#     #         #         my_list.append(str.replace(" ",""))
                    
#     #         # else:
#     #         #     my_list.append(data[2])
#             # genre
#     #         if(data[3].find(",")!=-1):
#     #             for str in data[3].split(","):
#     #                 my_genre_list.append(str.replace(" ",""))
#     #         else:
#     #             if(data[3]!="genre"):
#     #                 my_genre_list.append(data[3])
#     # my_autor_list = list(set(my_autor_list))
#     # my_genre_list = list(set(my_genre_list))
   

#     return Response(webtoon_list, status.HTTP_200_OK)

# def download_file(url):    

#     urllib.request.urlretrieve(url, filename)    

# # urllib.error.HTTPError: HTTP Error 403: Forbidden

# # 에러에 대한 해결코드



# opener=urllib.request.build_opener()

# opener.addheaders=[('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1941.0 Safari/537.36')]

# urllib.request.install_opener(opener)

# webtoons = Webtoon.objects.all()
    
# for webtoon in webtoons:
#     diff = 0
    
#     if webtoon.image_type1 is None:
#         url = webtoon.thumbnail
#         webtoon_title = webtoon.title
#         filename = f"{webtoon_title}.jpg"
#         try:
#             download_file(url)
#         except:
#             pass
      

# ## 플랫폼 데이터 넣기
# platforms = ["kakao", "kakao-page"]
# for platform in platforms:
#     Platform.objects.create(
#         name = platform
#     )


# ## 날짜 데이터 넣기
# weeks = { 0: "Mon", 1: "Tue", 2: "Wed", 3:"Thu",4:"Fri",5:"Sat",6:"Sun", 7: "Fin"}
# for i in range(8):
#     Day.objects.create(
#         name = weeks[i]
#     )

# ## 장르 데이터 넣기

# genres = ["감성","개그","드라마","로맨스","무협/사극","스릴러","스포츠","액션","일상","판타지","스토리","에피소드","옴니버스"]

# for genre in genres:
#     genre_create = Genre.objects.create(
#         genre_type = genre
#     )

# ## 태그 데이터 넣기
# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# headers = {'User-Agent':'mozilla/5.0'}
# webtoon_tag = set()

# for webtoon in webtoons_popular:
#     try:
#         webtoon_url = webtoon['url'].split('/')
#         webtoon_id = webtoon_url[-1]
#         data = requests.get(f'https://gateway-kw.kakao.com/decorator/v1/decorator/contents/{webtoon_id}/profile', headers=headers)
#         webtoon_tags = data.json()['data']['seoKeywords']

#         for tag in webtoon_tags:
#             webtoon_tag.add(tag)
    
#     except:
#         print(webtoon['url'])
#         print(data.json())

# for tag in webtoon_tag:
#     tag = tag.replace('#', '')
#     if Tag.objects.filter(name = tag).exists():
#         pass
#     else:
#         Tag.objects.create(
#             name = tag
#         )

# ## 카카오 작가 데이터 넣기
# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao-page'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# authors = set()

# for webtoon in webtoons_popular:
#     webtoon_author = webtoon['author'].split(",")

#     for author in webtoon_author:
#         authors.add(author)

# for author in authors:
#     if Author.objects.filter(name = author).exists():
#         pass
#     else:
#         Author.objects.create(
#             name = author
#         )

# ## 카카오 줄거리 넣기

# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# webtoons = Webtoon.objects.filter(summary='')
# for webtoon in webtoons:
#     webtoon_url = webtoon.page
#     try: 
#         headers = {'User-Agent':'mozilla/5.0'}
#         data = requests.get(f'{webtoon_url}', headers=headers)
#         soup = BeautifulSoup(data.text, 'html.parser')
#         webtoon_summary = soup.select_one('head > meta:nth-child(6)')['content']
#     except:
#         webtoon_summary = ''
#     webtoon.summary = webtoon_summary
#     webtoon.save()


# ## 카카오 줄거리 넣기
# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# webtoons = Webtoon.objects.filter(summary='')
# headers = {'User-Agent':'mozilla/5.0'}
# for webtoon in webtoons:
#     webtoon_url = webtoon.page
#     webtoon_data_url = webtoon_url.split("/")
#     webtoon_id = webtoon_data_url[-1]
#     data = requests.get(f'https://gateway-kw.kakao.com/decorator/v1/decorator/contents/{webtoon_id}/profile', headers=headers)
#     webtoon_summary = data.json()['data']['synopsis']
#     webtoon.summary = webtoon_summary
#     webtoon.save()


# if __name__ == '__main__':
#     weeks = { 0: "Mon", 1: "Tue", 2: "Wed", 3:"Thu",4:"Fri",5:"Sat",6:"Sun", 7: "Fin"}

#     genre_change = {
#         '학원': '일상',
#         '무협': '무협/사극',
#         '코믹': '개그',
#     }

#     Base_URL = 'https://korea-webtoon-api.herokuapp.com'
#     path = '/kakao-page'
#     response = requests.get(Base_URL+path)
#     webtoons_popular = response.json()
#     i = 0
#     for webtoon in webtoons_popular:
#         webtoon_title = webtoon['title']
#         webtoon_author = webtoon['author']
#         webtoon_url = webtoon['url']
#         webtoon_img = webtoon['img']
#         webtoon_platform = webtoon['service']
#         webtoon_adult = webtoon['additional']['adult']
#         webtoon_day = webtoon['week']


#         webtoon_author = webtoon_author.split(",")


#         ## 카카오 줄거리 크롤링
#         try: 
#             headers = {'User-Agent':'mozilla/5.0'}
#             data = requests.get(f'{webtoon_url}', headers=headers)
#             soup = BeautifulSoup(data.text, 'html.parser')
#             webtoon_summary = soup.select_one('head > meta:nth-child(4)')['content']
#         except:
#             webtoon_summary = ''


#         ## 카카오 장르 크롤링
#         try:
#             webtoon_genres = soup.select_one('#root > main > div > div > div > div.h-full.overflow-hidden.w-full.z-1.fixed.inset-0.bg-dark-background > div.w-full.left-0.top-0.relative > div.content-main-wrapper.opacity-0.invisible.relative.current-content-main.opacity-100.\!visible.z-1 > div.pb-20.pt-96.relative.z-1 > div.relative.mx-auto.my-0.w-full.lg\:w-default-max-width > div.mx-20.flex.justify-between.relative.z-1.pointer-events-auto.pt-12 > div > div > p.whitespace-pre-wrap.break-all.break-words.support-break-word.s12-regular-white.ml-3.opacity-85').text
#             if webtoon_genres == '공포/스릴러':
#                 webtoon_genres = '스릴러'
#                 webtoon_genres = webtoon_genres.split()

#             elif webtoon_genres.find('/') != -1:
#                 webtoon_genres = webtoon_genres.split('/')
#                 for idx in range(2):
#                     if webtoon_genres[idx] in ['학원', '무협', '코믹']:
#                         webtoon_genres[idx] = genre_change[webtoon_genres[idx]]
            
#             else:
#                 webtoon_genres = webtoon_genres.split()
#         except:
#             webtoon_genres = []


#         ## 카카오 태그 크롤링
#         webtoon_data_url = webtoon_url.split("/")
#         webtoon_id = webtoon_data_url[-1]
#         data = requests.get(f'https://gateway-kw.kakao.com/decorator/v1/decorator/contents/{webtoon_id}/profile', headers=headers)
#         webtoon_tags = data.json()['data']['seoKeywords']

#         if Webtoon.objects.filter(title = webtoon_title).exists():
#             pass
#         else:
#             webtoon_data = Webtoon.objects.create(
#                 title = webtoon_title,
#                 thumbnail = webtoon_img,
#                 page = webtoon_url,
#                 adult = webtoon_adult,
#                 view_count = 0,
#                 summary = webtoon_summary,
#             )

#             for author in webtoon_author:
#                 webtoon_data.authors.add(Author.objects.get(name = author).author_id)

#             for week in webtoon_day:
#                 webtoon_data.days.add(week+1)

#             if webtoon_genres:
#                 for genre in webtoon_genres:
#                     webtoon_data.genres.add(Genre.objects.get(genre_type=genre).genre_id)

#             for tag in webtoon_tags:
#                 tag = tag.replace('#','')
#                 webtoon_data.tags.add(Tag.objects.get(name=tag).tag_id)
            
#             webtoon_data.platforms.add(Platform.objects.get(name=webtoon_platform).platform_id)



    
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
    # {'로맨스', '공포/스릴러', '학원/판타지', '로맨스 판타지', '드라마', '액션/무협', '판타지 드라마', '코믹/일상'}
    
    

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


# a = open('./Webtoon_Label_6.json', encoding='utf-8-sig')

# webtoon_list = json.load(a)

# for webtoons in webtoon_list:

#     webtoon_title = webtoons['img_name']
#     img_0 = webtoons['0']
#     img_1 = webtoons['1']
#     img_2 = webtoons['2']
#     img_3 = webtoons['3']
#     img_4 = webtoons['4']
#     img_5 = webtoons['5']

#     if Webtoon.objects.filter(title = webtoon_title).exists():
#         toon = Webtoon.objects.filter(title = webtoon_title)

#         toon.update(
#             image_type1 = img_0,
#             image_type2 = img_1,
#             image_type3 = img_2,
#             image_type4 = img_3,
#             image_type5 = img_4,
#             image_type6 = img_5,
#         )

## 카카오페이지 장르 데이터
# KakaoPageGenreChange = {
#     ' 액션/무협':['액션','무협/사극'],
#     ' 로맨스판타지':['로맨스','판타지'],
#     ' 로맨스':'로맨스',
#     ' 드라마':'드라마',
#     ' 소년':'소년',
#     ' BL': 'BL'
#      }


# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao-page'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# webtoon_genres = set()
# count = 0
# print(len(webtoons_popular))
# for webtoon in webtoons_popular:
#     webtoon_url = webtoon['url']
#     webtoon_id = webtoon_url.split('=')[-1]
#     count += 1
#     print(count)
#     webtoon_except = []

#     ## 카카오 페이지 장르 크롤링
#     try: 
#         headers = {'User-Agent':'mozilla/5.0'}
#         data = requests.get(f'{webtoon_url}', headers=headers)
#         soup = BeautifulSoup(data.text, 'html.parser')
#         webtoon_genre_list = json.loads(soup.select_one('body > #__NEXT_DATA__').text)
#         webtoon_genres.add(webtoon_genre_list['props']['pageProps']['initialState']['json']['contentHome']['fetching']['about'][f'{webtoon_id}']['data']['detail']['category'].split('|')[-1])
#     except:
#         webtoon_except.append(webtoon_id)

# print(webtoon_genre_list['props']['pageProps']['initialState']['json']['contentHome']['fetching']['about']['46610003']['data']['detail']['category'].split('|')[-1])



# Base_URL = 'https://korea-webtoon-api.herokuapp.com'
# path = '/kakao-page'
# response = requests.get(Base_URL+path)
# webtoons_popular = response.json()
# count = 0
# webtoon_except = []

# for webtoon in webtoons_popular:
#     webtoon_url = webtoon['url']
#     webtoon_id = webtoon_url.split('=')[-1]
#     count += 1
#     print(count)
#     if count == 10:
#         break
    

#     ## 카카오 페이지 줄거리 크롤링
#     try: 
#         headers = {'User-Agent':'mozilla/5.0'}
#         data = requests.get(f'{webtoon_url}', headers=headers)
#         soup = BeautifulSoup(data.text, 'html.parser')
#         webtoon_summary = soup.select_one('head > meta:nth-child(9)')['content']
#         print(webtoon_summary)
#     except:
#         webtoon_except.append(webtoon_id)


# ## 카카오 페이지 데이터 넣기
# if __name__ == '__main__':
#     weeks = { 0: "Mon", 1: "Tue", 2: "Wed", 3:"Thu",4:"Fri",5:"Sat",6:"Sun", 7: "Fin"}

#     KakaoPageGenreChange = {
#         ' 액션/무협':['액션','무협/사극'],
#         ' 로맨스판타지':['로맨스','판타지'],
#         ' 로맨스':['로맨스'],
#         ' 드라마':['드라마'],
#         ' 소년':['소년'],
#         ' BL': ['BL']
#         }

#     Base_URL = 'https://korea-webtoon-api.herokuapp.com'
#     path = '/kakao-page'
#     response = requests.get(Base_URL+path)
#     webtoons_popular = response.json()

#     for webtoon in webtoons_popular:
#         webtoon_title = webtoon['title']
#         webtoon_author = webtoon['author'].split(',')
#         webtoon_url = webtoon['url']
#         webtoon_img = webtoon['img']
#         webtoon_platform = webtoon['service']
#         webtoon_adult = webtoon['additional']['adult']
#         webtoon_day = webtoon['week']
#         webtoon_id = webtoon_url.split('=')[-1]



#         ## 카카오 페이지 줄거리 크롤링
#         try: 
#             headers = {'User-Agent':'mozilla/5.0'}
#             data = requests.get(f'{webtoon_url}', headers=headers)
#             soup = BeautifulSoup(data.text, 'html.parser')
#             webtoon_summary = soup.select_one('head > meta:nth-child(9)')['content']
#         except:
#             webtoon_summary = ''


#         ## 카카오 페이지 장르 크롤링
#         try:
#             webtoon_genre_list = json.loads(soup.select_one('body > #__NEXT_DATA__').text)
#             webtoon_genres = webtoon_genre_list['props']['pageProps']['initialState']['json']['contentHome']['fetching']['about'][f'{webtoon_id}']['data']['detail']['category'].split('|')[-1]
#             webtoon_genres = KakaoPageGenreChange[webtoon_genres]

#         except:
#             webtoon_genres = []


#         if Webtoon.objects.filter(title = webtoon_title).exists():
#             kakaoWebtoon = Webtoon.objects.filter(title = webtoon_title).get()
#             kakaoWebtoon.platforms.add(Platform.objects.get(name=webtoon_platform).platform_id)
#         else:
#             webtoon_data = Webtoon.objects.create(
#                 title = webtoon_title,
#                 thumbnail = webtoon_img,
#                 page = webtoon_url,
#                 adult = webtoon_adult,
#                 view_count = 0,
#                 summary = webtoon_summary,
#             )

#             for author in webtoon_author:
#                 webtoon_data.authors.add(Author.objects.get(name = author).author_id)

#             for week in webtoon_day:
#                 webtoon_data.days.add(week+1)

#             if webtoon_genres:
#                 for genre in webtoon_genres:
#                     webtoon_data.genres.add(Genre.objects.get(genre_type=genre).genre_id)
            
#             webtoon_data.platforms.add(Platform.objects.get(name=webtoon_platform).platform_id)


## 카카오웹툰 장르 넣기
# if __name__ == '__main__':
#     genre_change = {
#         '학원': '일상',
#         '무협': '무협/사극',
#         '코믹': '개그',
#     }

#     Base_URL = 'https://korea-webtoon-api.herokuapp.com'
#     path = '/kakao'
#     response = requests.get(Base_URL+path)
#     webtoons_popular = response.json()
#     i = 0
#     for webtoon in webtoons_popular:
#         webtoon_title = webtoon['title']
#         webtoon_url = webtoon['url']
#         try:
#             webtoon_data = Webtoon.objects.get(title=webtoon_title)
#             genre_data = webtoon_data.genres.all()
#             genre_data_length = len(genre_data)
            
#             if not genre_data_length:
#             ## 카카오 장르 크롤링
#                 try:
#                     headers = {'User-Agent':'mozilla/5.0'}
#                     data = requests.get(f'{webtoon_url}', headers=headers)
#                     soup = BeautifulSoup(data.text, 'html.parser')            
#                     webtoon_genres = soup.select_one('#root > main > div > div > div > div.h-full.overflow-hidden.w-full.z-1.fixed.inset-0.bg-dark-background > div.w-full.left-0.top-0.relative > div.content-main-wrapper.opacity-0.invisible.relative.current-content-main.opacity-100.\!visible.z-1 > div.pb-20.pt-96.relative.z-1 > div.relative.mx-auto.my-0.w-full.lg\:w-default-max-width > div.mx-20.flex.justify-between.relative.z-1.pointer-events-auto.pt-12 > div > div > p.whitespace-pre-wrap.break-all.break-words.support-break-word.s12-regular-white.ml-3.opacity-85').text
#                     if webtoon_genres == '공포/스릴러':
#                         webtoon_genres = '스릴러'
#                         webtoon_genres = webtoon_genres.split()

#                     elif webtoon_genres.find('/') != -1:
#                         webtoon_genres = webtoon_genres.split('/')
#                         for idx in range(2):
#                             if webtoon_genres[idx] in ['학원', '무협', '코믹']:
#                                 webtoon_genres[idx] = genre_change[webtoon_genres[idx]]
                    
#                     else:
#                         webtoon_genres = webtoon_genres.split()
#                 except:
#                     webtoon_genres = []

#                 i += 1
#                 print(webtoon_title)
                
#                 if webtoon_genres:
#                     for genre in webtoon_genres:
#                         webtoon_data.genres.add(Genre.objects.get(genre_type=genre).genre_id)
#         except:
#             print(webtoon_title)


# tb_draw_classify 삽입
# recommended_webtoons = [1,4,23,27]
# webtoons = Webtoon.objects.filter(webtoon_id__in = recommended_webtoons)
# +7+
# print(webtoon_list)   


# print(len(Webtoon.objects.filter(image_type1__gte = 95)))
# print(len(Webtoon.objects.filter(image_type2__gte = 100)))
# print(len(Webtoon.objects.filter(image_type3__gte = 99.99)))
# print(len(Webtoon.objects.filter(image_type4__gte = 95)))
# print(len(Webtoon.objects.filter(image_type5__gte = 99.8)))
# print(len(Webtoon.objects.filter(image_type6__gte = 98)))

# webtoons = Webtoon.objects.filter(image_type6__gte = 98)
# lst = [26,27,28,29,30]

# for webtoon in webtoons:
#     type_data = webtoon.draw_classifies.all().get().classify_id
#     num = 0
#     for i in lst:
#         if type_data != i:
#             num += 1
#             webtoon.draw_classifies.add(i)
#         print(num)

# # 그림체 차이 계산
# def typeToDifference(type, original, comparsion):
#     first_diff = 0
#     second_diff = 0

#     type1_diff = abs(original.image_type1 - comparsion.image_type1)
#     type2_diff = abs(original.image_type2 - comparsion.image_type2)
#     type3_diff = abs(original.image_type3 - comparsion.image_type3)
#     type4_diff = abs(original.image_type4 - comparsion.image_type4)
#     type5_diff = abs(original.image_type5 - comparsion.image_type5)
#     type6_diff = abs(original.image_type6 - comparsion.image_type6)

#     if(type==1): 
#         first_diff = type1_diff
#         second_diff = type2_diff
#     elif(type==2): 
#         first_diff = type1_diff
#         second_diff = type3_diff
#     elif(type==3): 
#         first_diff = type1_diff
#         second_diff = type4_diff
#     elif(type==4): 
#         first_diff = type1_diff
#         second_diff = type5_diff
#     elif(type==5): 
#         first_diff = type1_diff
#         second_diff = type6_diff
#     elif(type==6): 
#         first_diff = type2_diff
#         second_diff = type1_diff
#     elif(type==7): 
#         first_diff = type2_diff
#         second_diff = type3_diff
#     elif(type==8): 
#         first_diff = type2_diff
#         second_diff = type4_diff
#     elif(type==9): 
#         first_diff = type2_diff
#         second_diff = type5_diff
#     elif(type==10): 
#         first_diff = type2_diff
#         second_diff = type6_diff
#     elif(type==11): 
#         first_diff = type3_diff
#         second_diff = type1_diff
#     elif(type==12): 
#         first_diff = type3_diff
#         second_diff = type2_diff
#     elif(type==13): 
#         first_diff = type3_diff
#         second_diff = type4_diff
#     elif(type==14): 
#         first_diff = type3_diff
#         second_diff = type5_diff
#     elif(type==15): 
#         first_diff = type3_diff
#         second_diff = type6_diff
#     elif(type==16): 
#         first_diff = type4_diff
#         second_diff = type1_diff
#     elif(type==17): 
#         first_diff = type4_diff
#         second_diff = type2_diff
#     elif(type==18): 
#         first_diff = type4_diff
#         second_diff = type3_diff
#     elif(type==19): 
#         first_diff = type4_diff
#         second_diff = type5_diff
#     elif(type==20): 
#         first_diff = type4_diff
#         second_diff = type6_diff
#     elif(type==21): 
#         first_diff = type5_diff
#         second_diff = type1_diff
#     elif(type==22): 
#         first_diff = type5_diff
#         second_diff = type2_diff
#     elif(type==23): 
#         first_diff = type5_diff
#         second_diff = type3_diff
#     elif(type==24): 
#         first_diff = type5_diff
#         second_diff = type4_diff
#     elif(type==25): 
#         first_diff = type5_diff
#         second_diff = type6_diff
#     elif(type==26): 
#         first_diff = type6_diff
#         second_diff = type1_diff
#     elif(type==27): 
#         first_diff = type6_diff
#         second_diff = type2_diff
#     elif(type==28): 
#         first_diff = type6_diff
#         second_diff = type3_diff
#     elif(type==29): 
#         first_diff = type6_diff
#         second_diff = type4_diff
#     elif(type==30): 
#         first_diff = type6_diff
#         second_diff = type5_diff

#     diff = first_diff * 1.1 + second_diff

#     difference = {"webtoon_id" : comparsion.webtoon_id , "diff" : diff}
#     return difference


# tb_draw_classify 삽입

# def insertClassify(request):
#     webtoons = Webtoon.objects.all()

#     for webtoon in webtoons:
#         list = []   
#         list.append(webtoon.image_type1)
#         list.append(webtoon.image_type2)
#         list.append(webtoon.image_type3)
#         list.append(webtoon.image_type4)
#         list.append(webtoon.image_type5)
#         list.append(webtoon.image_type6)
        
#         first_max = max(list)
#         second_max = 0
#         for max_i in list:
#             if(first_max > max_i and max_i > second_max):
#                 second_max = max_i

#         first = list.index(first_max)+1
#         second = list.index(second_max)+1
#         type = 0
#         if(first==1 and second == 2):
#             type = 1
#         elif(first==1 and second == 3):
#             type = 2 
#         elif(first==1 and second == 4):
#             type = 3 
#         elif(first==1 and second == 5):
#             type = 4 
#         elif(first==1 and second == 6):
#             type = 5 
#         elif(first==2 and second == 1):
#             type = 6 
#         elif(first==2 and second == 3):
#             type = 7 
#         elif(first==2 and second == 4):
#             type = 8 
#         elif(first==2 and second == 5):
#             type = 9 
#         elif(first==2 and second == 6):
#             type = 10 
#         elif(first==3 and second == 1):
#             type = 11 
#         elif(first==3 and second == 2):
#             type = 12 
#         elif(first==3 and second == 4):
#             type = 13 
#         elif(first==3 and second == 5):
#             type = 14 
#         elif(first==3 and second == 6):
#             type = 15 
#         elif(first==4 and second == 1):
#             type = 16 
#         elif(first==4 and second == 2):
#             type = 17 
#         elif(first==4 and second == 3):
#             type = 18 
#         elif(first==4 and second == 5):
#             type = 19 
#         elif(first==4 and second == 6):
#             type = 20 
#         elif(first==5 and second == 1):
#             type = 21 
#         elif(first==5 and second == 2):
#             type = 22 
#         elif(first==5 and second == 3):
#             type = 23 
#         elif(first==5 and second == 4):
#             type = 24 
#         elif(first==5 and second == 6):
#             type = 25 
#         elif(first==6 and second == 1):
#             type = 26 
#         elif(first==6 and second == 2):
#             type = 27 
#         elif(first==6 and second == 3):
#             type = 28 
#         elif(first==6 and second == 4):
#             type = 29 
#         elif(first==6 and second == 5):
#             type = 30 

#         # modeling 후 insert 
#         webtoon.classify_id.add(type)

    # return Response(status.HTTP_201_CREATED)

# webtoon마다 similar_webtoons id string으로 넣어주기
# webtoon_list = Webtoon.objects.all()

# # 각 이미지 타입 비율 불러와 차이 계산 후 ((1순위 그림체 *1.1) + (2순위 그림체)) 낮은순으로 top30을 similar에 넣는다
# for webtoon in webtoon_list:
#     # 같은 타입애들을 불러오기
#     classify_list = webtoon.draw_classifies.all()
#     original_webtoon = Webtoon.objects.filter(pk=webtoon.webtoon_id)

#     # 그림체 분류 id로 불러오기
#     classify_id_list = []
#     for classify in classify_list:
#         classify_id_list.append(classify.classify_id)

#     # 그림체 정보가 1개 넘을 때는 대분류 정했던 로직처럼 similar에 넣어주기
#     if len(classify_id_list) > 1:
#         if classify_id_list[0] == 1:
#             similar_list = Webtoon.objects.filter(image_type1__gte = 95)[:31]
            
#         elif classify_id_list[0] == 6:
#             similar_list = Webtoon.objects.filter(image_type2__gte = 100)[:31]

#         elif classify_id_list[0] == 11:
#             similar_list = Webtoon.objects.filter(image_type3__gte = 99.99)[:31]

#         elif classify_id_list[0] == 16:
#             similar_list = Webtoon.objects.filter(image_type4__gte = 95)[:31]

#         elif classify_id_list[0] == 21:
#             similar_list = Webtoon.objects.filter(image_type5__gte = 99.8)[:31]

#         elif classify_id_list[0] == 26:
#             similar_list = Webtoon.objects.filter(image_type6__gte = 98)[:31]

#         similar_id_list = []
#         for similar in similar_list:
#             similar_id_list.append(similar.webtoon_id)
        
#         # 자기 자신 빼주기
#         if webtoon.webtoon_id in similar_id_list:
#             similar_id_list.remove(webtoon.webtoon_id)
        
#         insert_similar_webtoons = ','.join(str(item) for item in similar_id_list)

#     else:
#         type_list = Webtoon.objects.filter(draw_classifies__in = classify_id_list)
        
#         similar_list = []
#         for comparsion in type_list:
#             if(original_webtoon==comparsion):
#                 continue

#             diffResult = typeToDifference(classify_id_list[0], webtoon, comparsion)
#             similar_list.append(diffResult)
        
#         # 그림체 차이 순으로 정렬
#         newlist = sorted(similar_list, key = lambda idx: (idx['diff']))

#         # 자기 자신 빼주기
#         if {"webtoon_id" : webtoon.webtoon_id , "diff" : 0} in newlist:
#             newlist.remove({"webtoon_id" : webtoon.webtoon_id , "diff" : 0})
            
#         insert_similar_webtoons = ','.join([str(item['webtoon_id']) for item in newlist[:30]])
    
#     # insert to similar 그림체
#     original_webtoon.update(similar_webtoons=insert_similar_webtoons)

# QA - Detail 페이지
# for i in range(1700, 4882):
#     url = f'http://127.0.0.1:8000/api/webtoons/{i}/detail/'
#     # request the API data and convert the JSON to Python data types
#     webtoons = requests.get(url).json()
#     print(i)
