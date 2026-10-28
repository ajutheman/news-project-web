-- three dummy articles for tests and local development (invented text, not real news)
create temp table seed_a (slug text, title text, excerpt text, cat text, at timestamptz, prem boolean, ps text[]);
insert into seed_a values
 ('seed-market-closes-higher','ഓഹരി വിപണി ഇന്ന് നേരിയ നേട്ടത്തിൽ അവസാനിച്ചു','ബാങ്കിങ് ഓഹരികൾ മുന്നിൽ നിന്നു.','markets','2026-10-26 04:30+00',false,
  array['വ്യാപാര ദിവസത്തിന്റെ അവസാനം പ്രധാന സൂചികകൾ നേരിയ നേട്ടത്തിലായിരുന്നു.','നിക്ഷേപകർ അടുത്ത ദിവസങ്ങളിലെ പ്രഖ്യാപനങ്ങൾക്കായി കാത്തിരിക്കുകയാണ്.','ഇത് മാതൃകാ ഉള്ളടക്കമാണ്; യഥാർത്ഥ വാർത്തയല്ല.']),
 ('seed-six-ways-to-save','സമ്പാദ്യം തുടങ്ങാൻ ആറ് ലളിതമായ വഴികൾ','ചെറിയ തുകയിൽ നിന്ന് തുടങ്ങി ശീലമാക്കാം.','personal-finance','2026-10-26 03:30+00',true,
  array['PREVIEW-ONE മാസത്തിന്റെ തുടക്കത്തിൽ തന്നെ ഒരു തുക മാറ്റിവയ്ക്കുക.','PREVIEW-TWO ചെലവുകൾ എഴുതി സൂക്ഷിക്കുക.','SECRET-THREE അടിയന്തര ഫണ്ട് ഉണ്ടാക്കുക.','SECRET-FOUR ഇത് മാതൃകാ ഉള്ളടക്കമാണ്.']),
 ('seed-rupee-slips','രൂപയുടെ മൂല്യത്തിൽ ചെറിയ ഇടിവ്','എണ്ണവില ഉയർന്നതാണ് കാരണമെന്ന് വിദഗ്ധർ.','economy','2026-10-26 02:30+00',false,
  array['ഇന്ന് രൂപ ഡോളറിനെതിരെ അല്പം ദുർബലമായി.','ഇത് മാതൃകാ ഉള്ളടക്കമാണ്; യഥാർത്ഥ വാർത്തയല്ല.']);
insert into articles (slug, title, excerpt, category_id, author_id, status, published_at, read_minutes, is_premium, preview_paragraphs, preview_html)
select s.slug, s.title, s.excerpt, c.id, a.id, 'published', s.at, 2, s.prem, 2, '<p>' || s.ps[1] || '</p><p>' || s.ps[2] || '</p>'
  from seed_a s join categories c on c.slug = s.cat cross join (select id from authors where slug = 'desk') a
on conflict (slug) do nothing;
insert into article_bodies (article_id, body_json, body_html, body_text)
select ar.id, jsonb_build_object('paragraphs', to_jsonb(s.ps)), (select string_agg('<p>' || p || '</p>', '') from unnest(s.ps) p), array_to_string(s.ps, E'\n')
  from seed_a s join articles ar on ar.slug = s.slug
on conflict (article_id) do nothing;
