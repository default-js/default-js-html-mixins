const BODY = document.body;
const TIMEOUT = 250;

const EVENTTYPE ="mixin-filterable:action:filter-by";

const DENIED_CHARACHER_FILTER = /[^a-z0-9-_]/i;

const ATTR__FILTERABLE_ITEM_CONTAINER_SELECTOR = "filterable-item-container-selector";
const ATTR__FILTERABLE_ITEM_SELECTOR = "filter-content-selector";
const ATTR__FILTERABLE_ITEM = "filterable-item";
const ATTR__FILTERABLE_BY = "filterable-by";
const ATTR__FILTERABLE_BY_VALUE = "filterable-by-value";
const ATTR__FILTER_ACTIVE_MARKER = "active";
const ATTR__FILTER_ACTIVE = "active";

const SELECTOR_FILTERABLE_ITEM = `[${ATTR__FILTERABLE_ITEM}]`;

const CLASS__FILTER_MISMATCHED = "filterable-item-filter-mismatched";

const filterValue = (item, filterValueSelector, filterValueAttribute) => {
	if(item.is(filterValueSelector))
		return item.attr(filterValueAttribute);
	
	const result = item.find(filterValueSelector).first()
	if(result)
		return result.attr(filterValueAttribute);
	
	return null;
}


const MISMACHTEDFILTERFORITEM = new WeakMap();
const mismachtedFilterForItem = (item) => {
	let data = MISMACHTEDFILTERFORITEM.get(item);
	if(data == null || typeof data === "undefined"){
		data = new Map();
		MISMACHTEDFILTERFORITEM.set(item, data);
	}
	
	return data;	
}

const filter = (target) => {
	const filterActive = target.attr(ATTR__FILTER_ACTIVE_MARKER) != null;
	
	const container = target.find(target.attr(ATTR__FILTERABLE_ITEM_CONTAINER_SELECTOR)).first();	
	const itemSelector = (target.attr(ATTR__FILTERABLE_ITEM_SELECTOR) || SELECTOR_FILTERABLE_ITEM).trim();
	const filterBy = (target.attr(ATTR__FILTERABLE_BY) || "").trim().toLowerCase().replace(DENIED_CHARACHER_FILTER, "_");
	const filterByValue = (target.attr(ATTR__FILTERABLE_BY_VALUE) || "").trim().toLowerCase();
	const filterValueAttribute = `${ATTR__FILTERABLE_BY}--${filterBy}`;
	const filterValueSelector = `[${filterValueAttribute}]`;
	const filterKey = `${filterBy}::${filterByValue}`;
	container.find(itemSelector).forEach((item) => {
		const mismachtedFilter = mismachtedFilterForItem(item) ;
		if(filterActive)			
			mismachtedFilter.delete(filterKey);
		else{
			const value = filterValue(item, filterValueSelector, filterValueAttribute);
			if(value == null || value.trim().toLowerCase() != filterByValue)					
				mismachtedFilter.set(filterKey, true );
		}
		
		if(mismachtedFilter.size != 0)
			item.addClass(CLASS__FILTER_MISMATCHED);
		else
			item.removeClass(CLASS__FILTER_MISMATCHED);		
	});	
	target.toggleAttribute(ATTR__FILTER_ACTIVE);
}


BODY.on(EVENTTYPE, (event) => {
	event.stopPropagation();
	filter(event.target);
});