export const EXTRACT_ENTITY_CHAT = `

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

2. From the relationships identified in step 1, Identify each entity. For each identified entity, extract the following information:
- entity_name: Name of the entity
- entity_type: One of the following types: [ORG, PERSON, GEO, EVENT, ITEM, IDEA, ATTR]
- entity_description: Concise description of the entity, within 20 words.
Format each entity as (entity|<entity_name>|<entity_type>|<entity_description>)
 
3. Return output in English of all the relationships and entities identified in steps 1 and 2. For proper nouns like personal names, place names, and book titles, do not translate, output as they are.
 
`