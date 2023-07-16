const BODY = document.body;

const EVENTTYPE = "mixin-sortable:action:sort-by";

const ATTR__SORTABLE_ITEM_CONTAINER_SELECTOR = "sortable-item-container-selector";
const ATTR__SORTABLE_BY = "sortable-by";
const ATTR__SORTABLE_DIRECTON = "sortable-direction";

BODY.on(EVENTTYPE, (event) => {
	event.stopPropagation();
	const target = event.target;
	const sortContainer = target.find(target.attr(ATTR__SORTABLE_ITEM_CONTAINER_SELECTOR)).first();	
	const valueAttribute = `${ATTR__SORTABLE_BY}--${target.attr(ATTR__SORTABLE_BY)}`;
	const direction = (target.attr(ATTR__SORTABLE_DIRECTON) || "").trim().toLowerCase();
	
	const sorted = Array.from(sortContainer.children).sort((a, b) => {				
		const valueA = (a.attr(valueAttribute) || "").toLowerCase();
		const valueB = (b.attr(valueAttribute) || "").toLowerCase()		
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