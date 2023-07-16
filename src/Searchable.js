const BODY = document.body;
const TIMEOUT = 250;

const EVENTTYPE = "mixin-searchable:action:search";

// attribute with a selector of an container with all searchable items 
const ATTR__SEARCHABLE_ITEM_CONTAINER_SELECTOR = "searchable-item-container-selector";
// attribute with a selector for the searchable items
const ATTR__SEARCHABLE_ITEM_SELECTOR = "searchable-item-selector";
// default attribute as marker for a searchable marker. At this element would be add the class name, if it's sorted out.
const ATTR__SEARCHABLE_ITEM = "searchable-item";
// default attribute that defines the text content, which is used for search
const ATTR__SEARCHABLE_CONTENT = "searchable-content";

const SELECTOR_SEARCHABLE_ITEM = `:not([${ATTR__SEARCHABLE_ITEM}]) [${ATTR__SEARCHABLE_ITEM}]`;
const SELECTOR_SEARCHABLE_CONTENT = `[${ATTR__SEARCHABLE_CONTENT}]`;

// class name for an item which is sorted out
const CLASS__SEARCH_MISMATCHED = "searchable-item-mismatched";

const searchableContent = (target) => {
	const items = Array.from(target.find(SELECTOR_SEARCHABLE_CONTENT) || []);
	if(target.is(SELECTOR_SEARCHABLE_CONTENT))
		items.push(target);
		
	return items.map((item) => item.attr(ATTR__SEARCHABLE_CONTENT) || "").join(" ").toLowerCase();
}

const search = (target) => {
	const values = (target.value || "").trim().toLowerCase();
	const container = target.find(target.attr(ATTR__SEARCHABLE_ITEM_CONTAINER_SELECTOR)).first();
	const itemSelector = (target.attr(ATTR__SEARCHABLE_ITEM_SELECTOR) || SELECTOR_SEARCHABLE_ITEM).trim();
	container.find(itemSelector).removeClass(CLASS__SEARCH_MISMATCHED);
	if (values.length > 0) {
		const filter = values.split(/\s+/)
		container.find(itemSelector).forEach((item) => {
			const content =  searchableContent(item);
			if (filter.some((filter) => content.search(filter) < 0))
				item.addClass(CLASS__SEARCH_MISMATCHED);
		});
	}
}


let SEARCHTIMOUTID = null;
BODY.on(EVENTTYPE, (event) => {
	event.stopPropagation();
	const target = event.target;
	if (SEARCHTIMOUTID)
		clearTimeout(SEARCHTIMOUTID);

	SEARCHTIMOUTID = setTimeout(() => search(target), TIMEOUT);
});