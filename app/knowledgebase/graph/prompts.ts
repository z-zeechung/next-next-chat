export const EXTRACT_ENTITY_CHAT = `

-Goal-
Given a text document that is potentially relevant to this activity and a list of entity types, identify all relationships of those types from the text and all entities within the identified relationships.
 
-Steps-
1. Identify all pairs of (source_entity, target_entity) that are *clearly related* to each other.
For each pair of related entities, extract the following information:
- source_entity: name of the source entity, as identified in step 1
- target_entity: name of the target entity, as identified in step 1
- relationship_type: one of the following types: [EQUAL, IS, OTHER]
- relationship_description: Concise description of the relationship between the source_entity and the target_entity, within 20 words.
 Format each relationship as (relationship|<source_entity>|<target_entity>|<relationship_type>|<relationship_description>)

2. From the relationships identified in step 1, Identify each entity. For each identified entity, extract the following information:
- entity_name: Name of the entity
- entity_type: One of the following types: [ORG, PERSON, GEO, EVENT, ITEM, IDEA, ATTR]
- entity_description: Concise description of the entity, within 20 words.
Format each entity as (entity|<entity_name>|<entity_type>|<entity_description>)
 
3. Return output in English of all the relationships and entities identified in steps 1 and 2. For proper nouns like personal names, place names, and book titles, do not translate, output as they are.
 
`

export const EXTRACT_ENTITY_COMPLETION = (text: string) => `

-Goal-
Given a text document that is potentially relevant to this activity and a list of entity types, identify all relationships of those types from the text and all entities within the identified relationships.
 
-Steps-
1. Identify all pairs of (source_entity, target_entity) that are *clearly related* to each other.
For each pair of related entities, extract the following information:
- source_entity: name of the source entity, as identified in step 1
- target_entity: name of the target entity, as identified in step 1
- relationship_type: one of the following types: [EQUAL, IS, OTHER]
- relationship_description: Concise description of the relationship between the source_entity and the target_entity, within 20 words.
 Format each relationship as (relationship|<source_entity>|<target_entity>|<relationship_type>|<relationship_description>)

2. Identify each entity *within* the relationships identified in step 1. For each identified entity, extract the following information:
- entity_name: Name of the entity
- entity_type: One of the following types: [ORG, PERSON, GEO, EVENT, ITEM, IDEA, ATTR]
- entity_description: Concise description of the entity, within 20 words.
Format each entity as (entity|<entity_name>|<entity_type>|<entity_description>)
 
3. Return output in English of all the relationships and entities identified in steps 1 and 2. For proper nouns like personal names, place names, and book titles, do not translate, output as they are.

4. Please note that all entities must be derived from existing relationships to avoid isolated entity nodes.
 
######################
-Examples-
######################
Example 1:
Relationship_types: EQUAL,IS,OTHER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
Victor Hugo (born February 26, 1802, Besançon, France—died May 22, 1885, Paris) was a poet, novelist, and dramatist who was the most important of the French Romantic writers. Though regarded in France as one of that country’s greatest poets, he is better known abroad for such novels as Notre-Dame de Paris (1831) and Les Misérables (1862).
Victor was the third son of Joseph-Léopold-Sigisbert Hugo, a major and, later, general in Napoleon’s army. His childhood was coloured by his father’s constant traveling with the imperial army and by the disagreements that soon alienated his parents from one another. His mother’s royalism and his father’s loyalty to successive governments—the Convention, the Empire, the Restoration—reflected their deeper incompatibility. It was a chaotic time for Victor, continually uprooted from Paris to set out for Elba or Naples or Madrid, yet always returning to Paris with his mother, whose royalist opinions he initially adopted. The fall of the empire gave him, from 1815 to 1818, a time of uninterrupted study at the Pension Cordier and the Lycée Louis-le-Grand, after which he graduated from the law faculty at Paris, where his studies seem to have been purposeless and irregular. Memories of his life as a poor student later inspired the figure of Marius in his novel Les Misérables.
######################
Output:
(relationship|Victor Hugo|February 26, 1802|OTHER|Victor Hugo was born on February 26, 1802)
(relationship|Victor Hugo|Besançon|OTHER|Victor Hugo was born at Besançon)
(relationship|Victor Hugo|France|OTHER|Victor Hugo was a citizen of France)
(relationship|Victor Hugo|May 22, 1885|OTHER|Victor Hugo died on May 22, 1885)
(relationship|Victor Hugo|Paris|OTHER|Victor Hugo died at Paris)
(relationship|Notre-Dame de Paris|Victor Hugo|OTHER|Victor Hugo wrote Notre-Dame de Paris)
(relationship|Les Misérables|Victor Hugo|OTHER|Victor Hugo wrote Les Misérables)
(relationship|Victor Hugo|Joseph-Léopold-Sigisbert Hugo|OTHER|Victor Hugo was the son of Joseph-Léopold-Sigisbert Hugo)
(relationship|Joseph-Léopold-Sigisbert Hugo|Napoleon’s army|OTHER|Joseph-Léopold-Sigisbert Hugo served at Napoleon’s army)
(relationship|Victor Hugo|Pension Cordier|OTHER|Victor Hugo studied at Pension Cordier)
(relationship|Victor Hugo|Lycée Louis-le-Grand|OTHER|Victor Hugo graduated from Lycée Louis-le-Grand)
(relationship|Marius|Victor Hugo|OTHER|The figure of Marius was inspired by Victor Hugo himself)
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
Relationship_types: EQUAL,IS,OTHER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
南京信息工程大学(Nanjing University of Information Science and Technology，nuist)，简称“南信大”，位于江苏省南京市，是国家“双一流”建设高校、江苏高水平大学建设高峰计划A类建设高校，现为由江苏省主管的中央与地方共建高校。拥有中国政府、教育部、江苏省政府奖学金等招收来华留学生资格，拥有2011协同创新中心，是国家建设高水平大学公派研究生项目高校、教育部“卓越工程师教育培养计划”高校、全国首批深化创新创业教育改革示范高校。
######################
Output:
(relationship|南京信息工程大学|Nanjing University of Information Science and Technology|EQUAL|南京信息工程大学的英文名为Nanjing University of Information Science and Technology)
(relationship|南京信息工程大学|nuist|EQUAL|南京信息工程大学的英文缩写为nuist)
(relationship|南京信息工程大学|南信大|EQUAL|南京信息工程大学简称南信大)
(relationship|南京信息工程大学|南京市|OTHER|南京信息工程大学位于江苏省南京市)
(relationship|南京信息工程大学|国家“双一流”建设高校|OTHER|南京信息工程大学是一所国家“双一流”建设高校)
(relationship|南京信息工程大学|江苏高水平大学建设高峰计划A类建设高校|OTHER|南京信息工程大学是一所江苏高水平大学建设高峰计划A类建设高校)
(relationship|南京信息工程大学|中央与地方共建高校|OTHER|南京信息工程大学是一所中央与地方共建高校)
(relationship|南京信息工程大学|中国政府奖学金|OTHER|南京信息工程大学颁发中国政府奖学金)
(relationship|南京信息工程大学|教育部奖学金|OTHER|南京信息工程大学颁发教育部奖学金)
(relationship|南京信息工程大学|江苏省政府奖学金|OTHER|南京信息工程大学颁发江苏省政府奖学金)
(relationship|南京信息工程大学|2011协同创新中心|OTHER|南京信息工程大学有2011协同创新中心)
(relationship|南京信息工程大学|国家建设高水平大学公派研究生项目高校|OTHER|南京信息工程大学属于国家建设高水平大学公派研究生项目)
(relationship|南京信息工程大学|教育部“卓越工程师教育培养计划”高校|OTHER|南京信息工程大学参与了教育部“卓越工程师教育培养计划”)
(relationship|南京信息工程大学|全国首批深化创新创业教育改革示范高校|OTHER|南京信息工程大学被列为全国首批深化创新创业教育改革示范高校)
(entity|南京信息工程大学|ORG|中国江苏省公办高校)
(entity|Nanjing University of Information Science and Technology|ORG|南京信息工程大学的英文名)
(entity|nuist|ORG|南京信息工程大学的英文缩写)
(entity|南信大|ORG|南京信息工程大学的简称)
(entity|南京市|GEO|中国江苏省下辖地级市、省会城市)
(entity|国家“双一流”建设高校|ITEM|国家“双一流”建设高校是指世界一流大学和一流学科的简称，是中共中央、国务院作出的重大战略决策‌。)
(entity|江苏高水平大学建设高峰计划A类建设高校|ITEM|江苏高水平大学建设方案子项目)
(entity|中央与地方共建高校|ITEM|即实行中央与地方共建、以地方管理为主的高校；原中央下划高校与地方院校合并、调整后组成的高校；部分地方重点支持的其他高校。)
(entity|中国政府奖学金|ITEM|中华人民共和国政府奖学金)
(entity|教育部奖学金|ITEM|教育部设立的奖学金)
(entity|江苏省政府奖学金|ITEM|江苏省政府设立的奖学金)
(entity|2011协同创新中心|ITEM|一般指高等学校创新能力提升计划)
(entity|国家建设高水平大学公派研究生项目高校|ITEM|推进高水平大学建设措施)
(entity|教育部“卓越工程师教育培养计划”高校|ITEM|教育部的重大改革项目)
(entity|全国首批深化创新创业教育改革示范高校|ITEM|部委联合实施的国家战略项目)

######################
Example 3:
Relationship_types: EQUAL,IS,OTHER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text:
淮陰侯韓信者，淮陰人也。始為布衣時，貧無行，不得推擇為吏，又不能治生商賈。常從人寄食飲，人多厭之者。常數從其下鄉南昌亭長寄食，數月，亭長妻患之，乃晨炊蓐食。食時，信往，不為具食。信亦知其意，怒，竟絕去。
######################
Output:
(relationship|韓信|淮陰侯|IS|韓信乃淮陰侯)
(relationship|韓信|淮陰|OTHER|韓信淮陰人也)
(relationship|韓信|布衣|IS|韓信始爲布衣)
(relationship|韓信|南昌亭長|OTHER|韓信嘗寄食于南昌亭)
(entity|淮陰侯|ORG|韓信之封號)
(entity|韓信|PERSON|漢初名將)
(entity|淮陰|GEO|地名，秦時始置，轄于東海郡)
(entity|布衣|IDEA|平民，無官爵)
(entity|南昌亭長|PERSON|秦官制，司警衛，理民事)

######################
-Real Data-
######################
Relationship_types: EQUAL,IS,OTHER
Entity_types: ORG,PERSON,GEO,EVENT,ITEM,IDEA,ATTR
Text: ${text}
######################
Output:
`