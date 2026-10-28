-- News category tree. Names in Malayalam are first drafts: have a Malayalam editor review them.
-- Section list informed by the public section menus of Manorama's sites and The Profit News; names and grouping are ours.
insert into categories (slug, name_ml, name_en, sort_order, show_in_nav, is_premium_section) values
 ('news','പ്രധാന വാർത്തകൾ','News',0,true,false),
 ('kerala','കേരളം','Kerala',1,true,false),
 ('india','ഇന്ത്യ','India',2,true,false),
 ('world','ലോകം','World',3,true,false),
 ('gulf','ഗൾഫ്','Gulf',4,true,false),
 ('business','ബിസിനസ്','Business',5,true,false),
 ('sports','കായികം','Sports',6,true,false),
 ('entertainment','വിനോദം','Entertainment',7,true,false),
 ('lifestyle','ലൈഫ്‌സ്റ്റൈൽ','Lifestyle',8,true,false),
 ('health','ആരോഗ്യം','Health',9,true,false),
 ('technology','സാങ്കേതികം','Technology',10,true,false),
 ('automobile','വാഹനം','Automobile',11,false,false),
 ('travel','യാത്ര','Travel',12,false,false),
 ('career','കരിയർ','Career',13,false,false),
 ('crime','ക്രൈം','Crime',14,false,false),
 ('opinion','അഭിപ്രായം','Opinion and columns',15,false,false),
 ('fact-check','ഫാക്ട് ചെക്ക്','Fact Check',16,false,false),
 ('youth-kids','യൂത്ത് & കിഡ്സ്','Youth and Kids',17,false,false),
 ('videos','വീഡിയോ','Videos',18,false,false),
 ('premium','പ്രീമിയം','Premium',19,true,true)
on conflict (slug) do nothing;
insert into categories (slug, name_ml, name_en, sort_order, show_in_nav, parent_id)
select v.slug, v.name_ml, v.name_en, v.sort_order, false, p.id from (values
 ('markets','വിപണി','Markets',0,'business'),
 ('personal-finance','വ്യക്തിഗത ധനകാര്യം','Personal Finance',1,'business'),
 ('economy','സമ്പദ്‌വ്യവസ്ഥ','Economy',2,'business'),
 ('industry','വ്യവസായം','Industry',3,'business'),
 ('banking-finance','ബാങ്കിങ്','Banking and Finance',4,'business'),
 ('startups','സ്റ്റാർട്ടപ്പ്','Startups',5,'business'),
 ('gold-silver','സ്വർണം, വെള്ളി','Gold and Silver',6,'business'),
 ('success-stories','വിജയകഥ','Success Stories',7,'business'),
 ('cricket','ക്രിക്കറ്റ്','Cricket',0,'sports'),
 ('football','ഫുട്ബോൾ','Football',1,'sports'),
 ('other-sports','മറ്റു കായികം','Other Sports',2,'sports'),
 ('movies','സിനിമ','Movies',0,'entertainment'),
 ('movie-reviews','റിവ്യൂ','Movie Reviews',1,'entertainment'),
 ('music','സംഗീതം','Music',2,'entertainment'),
 ('women','വനിത','Women',0,'lifestyle'),
 ('beauty-fashion','ഫാഷൻ','Beauty and Fashion',1,'lifestyle'),
 ('food','ഭക്ഷണം','Food',2,'lifestyle')
) as v(slug, name_ml, name_en, sort_order, parent) join categories p on p.slug = v.parent
on conflict (slug) do nothing;
insert into authors (slug, display_name) values ('desk','ഡെസ്ക്') on conflict (slug) do nothing;
-- amounts are placeholders: create the same plans in Razorpay TEST mode, then set provider_plan_id
insert into plans (code, name, amount_paise, billing_interval) values
 ('monthly','Monthly',9900,'month'), ('yearly','Yearly',99900,'year') on conflict (code) do nothing;
