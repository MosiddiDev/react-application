//********************//
//***** My SHims *****//
//********************//

Object.prototype.initArray = function(){
	if(this.isArray())
		return this;
	else if(this.length === undefined)
		return undefined;

	var arr = [];

	for(var i=0; i<this.length; i++){
		arr.push(this[i]);
	}

	return arr;
}

Object.prototype.isArray = function(){
	return Array.isArray(this);
}



//*************************//
//*** My List Component ***//
//*************************//

var MyListComponent = React.createClass({
	space: function(){
		var sharedGlobalNameSpace = this.props && this.props.space || 'DefaultSharedGlobalNameSpace';
		return ( window[sharedGlobalNameSpace] ||  ( window[sharedGlobalNameSpace] = {} ) )
	},
	getInitialState: function() {
		return {list: this.props.items};
	},
	updateList: function(list){
		this.setState({list: list});
	},
	removeOn: function(listItem){
		var list = this.state.list;

		for(var i=0; i<list.length; i++){
			if(listItem.id === list[i].id){
				list.splice(i,1);
				this.updateList(list);
				return;
			}
		}
	},
	addOn: function(listItem, newItem){
		var list = this.state.list;

		if(listItem.id === 'list-item-end'){
			list.splice(list.length,0,newItem);
			this.updateList(list);
			return;
		}

		for(var i=0; i<list.length; i++){

			if(listItem.id === list[i].id){
				list.splice(i,0,newItem);
				this.updateList(list);
				return;
			}
		}
	},
	drag: function(e){
		if(this.isLocked(e.target)){
			e.preventDefault();
			return;
		}

		// For FF (that sneaky Fox is picky)
		e.dataTransfer.setData("text/html", e.currentTarget);

		this.dragData = {id: e.target.id, name: e.target.textContent}
	},
	drop: function (e){
		if(this.space().dropTargetAction){
			this.removeOn(this.dragData);
			this.space().dropTargetAction(this.dragData);
		}
	},
	over: function (e){
		delete this.space().dropTargetAction;

		if(this.isLocked(e.target)){
			e.preventDefault();
			return;
		}

		var dropTarget = {id: e.target.id, name: e.target.textContent};

		this.space().dropTargetAction = (function(dropTarget, newItem) {
			this.addOn(dropTarget, newItem);
		}).bind(this, dropTarget)
	},
	toggleLock: function(e){
		if(!this.props.lockEnabled)
			return;

		e.target.classList.add('lockPivot');
		var listItems = e.target.parentNode.getElementsByClassName('list-item').initArray();

		for(var i=0; i<listItems.length; i++){
			if(listItems[i].classList.contains('lockPivot')){
				e.target.classList.remove('lockPivot');
				if(listItems[i].classList.contains('locked'))
					return this.lock(listItems, listItems.slice(0,i));
				return this.lock(listItems, listItems.slice(0,i+1));
			}
		}
	},
	lock: function(allListItems, lockListItems){
		for(var i=0; i<allListItems.length; i++){
			allListItems[i].classList.remove('locked');
		}
		for(var i=0; i<lockListItems.length; i++){
			lockListItems[i].classList.add('locked');
		}
	},
	isLocked: function(target){
		return target.classList.contains('locked');
	},
	render: function(){
        return (
        	<div className="list">
        	{	
				this.state.list.map(function(listItem, index, array) {
	                return (<div className="list-item" id={listItem.id} onDragStart={this.drag} onDragEnd={this.drop} onDragOver={this.over} onDoubleClick={this.toggleLock} draggable="true">{listItem.name}</div>)
	            },this)
        	}
        	<div className="list-item-end" id="list-item-end" onDragOver={this.over}>HEY</div>
        	</div>
        );
    }
});


//*******************************//
//*** My Main REact Component ***//
//*******************************//

var MyReactComponent = React.createClass({
	initItems: function(){
		this.visible = [];
		
		for(i in this.props.visible){
			for(j in this.props.available){
				if(this.props.available[j]['id'] === this.props.visible[i])
					this.visible.push(this.props.available.splice(j,1)[0]);
			}
		}

		this.available = this.props.available;
	},
	getVisibleItems: function(){
		var visible = []
	},
    save: function() {
        alert('saving column configuration');
    },
    close: function() {
        alert('closing component');
    },
    render: function() {
    	this.initItems();
        return (
            <div className="component">
                <span className="header">
                    <button onClick={this.close}
                            className="btn btn-danger glyphicon glyphicon-trash"/>
                </span>
                
                <div className="content">
                	<div className="available">
                		<MyListComponent items={this.props.available}/>
                	</div>
                	
                	<div className="visible">
                		<MyListComponent lockEnabled={true} locked={this.props.fixed} items={this.visible}/>
                	</div>
                </div>
                
                <span className="footer">
                    <button onClick={this.save}
                            className="btn btn-primary glyphicon glyphicon-pencil"/>
                    <button onClick={this.close}
                            className="btn btn-danger glyphicon glyphicon-trash"/>
                </span>
            </div>
        );
    }
});

var items = [
	{
		id: "item1",
		name: "Item One"
	},
	{
		id: "item2",
		name: "Item Two"
	},
	{
		id: "item3",
		name: "Item Three"
	},
	{
		id: "item4",
		name: "Item Four"
	},
	{
		id: "item5",
		name: "Item Five"
	},
	{
		id: "item6",
		name: "Item Six"
	},
	{
		id: "item7",
		name: "Item Seven"
	},
	{
		id: "item8",
		name: "Item Eight"
	},
	{
		id: "item9",
		name: "Item Nine"
	},
	{
		id: "item10",
		name: "Item Ten"
	}
]

var visibleItems = [
	'item2',
	'item4',
	'item6',
	'item8'
]

React.render(<MyReactComponent available={items} visible={visibleItems} fixed={3}/>, 
	document.getElementById('react-container'));
