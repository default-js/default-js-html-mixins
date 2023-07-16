const BODY = document.body;

const EVENTTYPE = "mixin-sortable:action:sort-by";

const ATTR__SORTABLE_ITEM_CONTAINER_SELECTOR = "sortable-item-container-selector";
const ATTR__SORTABLE_BY = "sortable-by";
const ATTR__SORTABLE_DIRECTON = "sortable-direction";

const getItemByAttribute = (item, attributeSelector) => {
	if(!item) 
		return null;

	if(item.is(attributeSelector))
		return item;
	
	return item.find(attributeSelector).first() || null;
}

const getValue = (item, attribute, attributeSelector) => {
	item = getItemByAttribute(item, attributeSelector);
	if(item != null)
		return item.attr(attribute);

	return null;
} 

BODY.on(EVENTTYPE, (event) => {
	event.stopPropagation();
	const target = event.target;
	const sortContainer = target.find(target.attr(ATTR__SORTABLE_ITEM_CONTAINER_SELECTOR)).first();	
	const valueAttribute = `${ATTR__SORTABLE_BY}--${target.attr(ATTR__SORTABLE_BY)}`;
	const valueSelector = `[${valueAttribute}]`;
	const direction = (target.attr(ATTR__SORTABLE_DIRECTON) || "").trim().toLowerCase();
	if(!sortContainer)
		return;
		
	const sorted = Array.from(sortContainer.children).sort((a, b) => {				
		const valueA = (getValue(a, valueAttribute, valueSelector) || "").toLowerCase();
		const valueB = (getValue(b, valueAttribute, valueSelector) || "").toLowerCase()		
		if (valueA < valueB)
			return -1;
		if (valueA > valueB)
			return 1;
		return 0;		
	});	
	
	if(direction && direction === "desc")
		sorted.reverse();
	
	sortContainer.empty().append(sorted);
});