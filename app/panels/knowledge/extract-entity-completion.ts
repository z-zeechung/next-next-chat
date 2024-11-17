export const EXTRACT_ENTITY_COMPLETION = (text: string) => `

-Goal-
Given a text document that is potentially relevant to this activity and a list of entity types, identify all relationships of those types from the text and all entities within the identified relationships.
 
-Steps-
1. Identify all pairs of (source_entity, target_entity) that are *clearly related* to each other.
For each pair of related entities, extract the following information:
- source_entity: name of the source entity, as identified in step 1
- target_entity: name of the target entity, as identified in step 1
- relationship_type: one of the following types: [EQUAL, IS, AT, BY, OF, FOR, WITH, OPPOSITE, INFER]
- relationship_description: Concise description of the relationship between the source_entity and the target_entity, within 20 words.
 Format each relationship as (relationship|<source_entity>|<target_entity>|<relationship_type>|<relationship_description>)

2. Identify each entity *within* the relationships identified in step 1. For each identified entity, extract the following information:
- entity_name: Name of the entity
- entity_type: One of the following types: [ORG, PERSON, GEO, EVENT, ITEM, IDEA, ATTR]
- entity_description: Concise description of the entity, within 20 words.
Format each entity as (entity|<entity_name>|<entity_type>|<entity_description>)
 
3. Return output in English of all the relationships and entities identified in steps 1 and 2. For proper nouns like personal names, place names, and book titles, do not translate, output as they are.
 
######################
-Examples-
######################
Example 1:
Relationship_types: EQUAL,IS,AT,BY,OF,FOR,WITH,OPPOSITE,INFER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
Victor Hugo (born February 26, 1802, Besançon, France—died May 22, 1885, Paris) was a poet, novelist, and dramatist who was the most important of the French Romantic writers. Though regarded in France as one of that country’s greatest poets, he is better known abroad for such novels as Notre-Dame de Paris (1831) and Les Misérables (1862).
Victor was the third son of Joseph-Léopold-Sigisbert Hugo, a major and, later, general in Napoleon’s army. His childhood was coloured by his father’s constant traveling with the imperial army and by the disagreements that soon alienated his parents from one another. His mother’s royalism and his father’s loyalty to successive governments—the Convention, the Empire, the Restoration—reflected their deeper incompatibility. It was a chaotic time for Victor, continually uprooted from Paris to set out for Elba or Naples or Madrid, yet always returning to Paris with his mother, whose royalist opinions he initially adopted. The fall of the empire gave him, from 1815 to 1818, a time of uninterrupted study at the Pension Cordier and the Lycée Louis-le-Grand, after which he graduated from the law faculty at Paris, where his studies seem to have been purposeless and irregular. Memories of his life as a poor student later inspired the figure of Marius in his novel Les Misérables.
######################
Output:
(relationship|Victor Hugo|February 26, 1802|AT|Victor Hugo was born on February 26, 1802)
(relationship|Victor Hugo|Besançon|AT|Victor Hugo was born at Besançon)
(relationship|Victor Hugo|France|OF|Victor Hugo was a citizen of France)
(relationship|Victor Hugo|May 22, 1885|AT|Victor Hugo died on May 22, 1885)
(relationship|Victor Hugo|Paris|AT|Victor Hugo died at Paris)
(relationship|Notre-Dame de Paris|Victor Hugo|BY|Victor Hugo wrote Notre-Dame de Paris)
(relationship|Les Misérables|Victor Hugo|BY|Victor Hugo wrote Les Misérables)
(relationship|Victor Hugo|Joseph-Léopold-Sigisbert Hugo|OF|Victor Hugo was the son of Joseph-Léopold-Sigisbert Hugo)
(relationship|Joseph-Léopold-Sigisbert Hugo|Napoleon’s army|AT|Joseph-Léopold-Sigisbert Hugo served at Napoleon’s army)
(relationship|Victor Hugo|Pension Cordier|AT|Victor Hugo studied at Pension Cordier)
(relationship|Victor Hugo|Lycée Louis-le-Grand|OF|Victor Hugo graduated from Lycée Louis-le-Grand)
(relationship|Marius|Victor Hugo|BY|The figure of Marius was inspired by Victor Hugo himself)
(entity|Victor Hugo|PERSON|French poet, novelist, and dramatist)
(entity|February 26, 1802|ATTR|Birth date of Victor Hugo)
(entity|Besançon|GEO|Birthplace of Victor Hugo)
(entity|France|GEO|Country where Victor Hugo was born)
(entity|May 22, 1885|ATTR|Death date of Victor Hugo)
(entity|Paris|GEO|City where Victor Hugo died)
(entity|Notre-Dame de Paris|ITEM|Novel written by Victor Hugo in 1831)
(entity|Les Misérables|ITEM|Novel written by Victor Hugo in 1862)
(entity|Joseph-Léopold-Sigisbert Hugo|PERSON|Father of Victor Hugo)
(entity|Napoleon|PERSON|Leader of the army where Joseph-Léopold-Sigisbert Hugo served)
(entity|Pension Cordier|ORG|School where Victor Hugo studied from 1815 to 1818)
(entity|Lycée Louis-le-Grand|ORG|School where Victor Hugo studied)
(entity|Marius|PERSON|Character in Les Misérables, inspired by Victor Hugo’s life as a student)

######################
Example 2:
Relationship_types: EQUAL,IS,AT,BY,OF,FOR,WITH,OPPOSITE,INFER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
南京信息工程大学(Nanjing University of Information Science and Technology，nuist)，简称“南信大”，位于江苏省南京市，是国家“双一流”建设高校、江苏高水平大学建设高峰计划A类建设高校，现为由江苏省主管的中央与地方共建高校。拥有中国政府、教育部、江苏省政府奖学金等招收来华留学生资格，拥有2011协同创新中心，是国家建设高水平大学公派研究生项目高校、教育部“卓越工程师教育培养计划”高校、全国首批深化创新创业教育改革示范高校。
######################
Output:
(relationship|南京信息工程大学|Nanjing University of Information Science and Technology|EQUAL|南京信息工程大学 is also known as Nanjing University of Information Science and Technology)
(relationship|南京信息工程大学|nuist|EQUAL|The abbreviation for Nanjing University of Information Science and Technology is nuist)
(relationship|南京信息工程大学|南信大|EQUAL|南京信息工程大学 is also called 南信大 for short)
(relationship|南京信息工程大学|南京市|AT|南京信息工程大学 is located in 江苏省南京市)
(relationship|南京信息工程大学|国家“双一流”建设高校|IS|南京信息工程大学 is a 国家“双一流”建设高校)
(relationship|南京信息工程大学|江苏高水平大学建设高峰计划A类建设高校|IS|南京信息工程大学 is a 江苏高水平大学建设高峰计划A类建设高校)
(relationship|南京信息工程大学|中央与地方共建高校|IS|南京信息工程大学 is a university jointly established by central and local governments)
(relationship|南京信息工程大学|中国政府奖学金|FOR|南京信息工程大学 offers 中国政府奖学金)
(relationship|南京信息工程大学|教育部奖学金|FOR|南京信息工程大学 offers 教育部奖学金)
(relationship|南京信息工程大学|江苏省政府奖学金|FOR|南京信息工程大学 offers 江苏省政府奖学金)
(relationship|南京信息工程大学|2011协同创新中心|WITH|南京信息工程大学 has a 2011协同创新中心)
(relationship|南京信息工程大学|国家建设高水平大学公派研究生项目高校|IS|南京信息工程大学 is a part of the 国家建设高水平大学公派研究生项目)
(relationship|南京信息工程大学|教育部“卓越工程师教育培养计划”高校|IS|南京信息工程大学 participates in the 教育部“卓越工程师教育培养计划”)
(relationship|南京信息工程大学|全国首批深化创新创业教育改革示范高校|IS|南京信息工程大学 is among the 全国首批深化创新创业教育改革示范高校)
(entity|南京信息工程大学|ORG|A university in Jiangsu Province, China)
(entity|Nanjing University of Information Science and Technology|ORG|The English name of 南京信息工程大学)
(entity|nuist|ORG|The abbreviation of Nanjing University of Information Science and Technology)
(entity|南信大|ORG|The short name of 南京信息工程大学)
(entity|南京市|GEO|The location of 南京信息工程大学)
(entity|国家“双一流”建设高校|ITEM|A title indicating high-level university in China)
(entity|江苏高水平大学建设高峰计划A类建设高校|ITEM|A title for top universities in Jiangsu Province)
(entity|中央与地方共建高校|ITEM|A type of university jointly established by central and local governments)
(entity|中国政府奖学金|ITEM|A scholarship funded by the Chinese government)
(entity|教育部奖学金|ITEM|A scholarship funded by the Ministry of Education of China)
(entity|江苏省政府奖学金|ITEM|A scholarship funded by the Jiangsu Provincial Government)
(entity|2011协同创新中心|ITEM|A program for collaborative innovation in China)
(entity|国家建设高水平大学公派研究生项目高校|ITEM|A title for universities with government-funded overseas graduate programs)
(entity|教育部“卓越工程师教育培养计划”高校|ITEM|A program for cultivating excellent engineers in China)
(entity|全国首批深化创新创业教育改革示范高校|ITEM|A title for universities leading in innovation and entrepreneurship education reform)

######################
Example 3:
Relationship_types: EQUAL,IS,AT,BY,OF,FOR,WITH,OPPOSITE,INFER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
淮陰侯韓信者，淮陰人也。始為布衣時，貧無行，不得推擇為吏，又不能治生商賈。常從人寄食飲，人多厭之者。常數從其下鄉南昌亭長寄食，數月，亭長妻患之，乃晨炊蓐食。食時，信往，不為具食。信亦知其意，怒，竟絕去。
######################
Output:
(relationship|韓信|淮陰侯|IS|韓信 was titled as 淮陰侯)
(relationship|韓信|淮陰|OF|韓信 was from 淮陰)
(relationship|韓信|布衣|IS|韓信 was initially a commoner)
(relationship|韓信|南昌亭長|WITH|韓信 often stayed with the head of 南昌亭)
(entity|淮陰侯|ORG|Title of nobility in ancient China)
(entity|韓信|PERSON|A person from ancient China, known as a military strategist)
(entity|淮陰|GEO|A place in ancient China, associated with 韓信)
(entity|布衣|IDEA|Commoner or ordinary person in ancient China)
(entity|南昌亭長|PERSON|The head of 南昌亭, where 韓信 once stayed)

######################
-Real Data-
######################
Relationship_types: EQUAL,IS,AT,BY,OF,FOR,WITH,OPPOSITE,INFER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text: ${text}
######################
Output:
`