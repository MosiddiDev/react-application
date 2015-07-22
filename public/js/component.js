var RB = ReactBootstrap;

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
	getInitialState: function(){
		var locked = this.props.lockEnabled ? (this.props.locked || 0) : 0;
		return {list: this.props.items, locked: locked};
	},
	updateList: function(list){
		this.setState({list: list});
	},
	updateLock: function(number){
		this.setState({locked: number});
	},
	getSimpleList: function(){
		var list = []

		for(var i=0; i<this.state.list.length; i++){
			list.push(this.state.list[i]['id']);
		}

		return list;
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

		this.space().dragData = {id: e.target.id, name: e.target.textContent};
		this.space().dropAction = (function(target) {
			this.removeOn(target);
		}).bind(this, this.space().dragData);
	},
	drop: function (e){
		if(this.isLocked(e.target)){
			e.preventDefault();
			return;
		}

		if(this.dropTarget){
			this.space().dropAction();
			this.addOn(this.dropTarget, this.space().dragData);
			this.removePlaceHolder();
			delete this.dropTarget;
		}
	},
	over: function (e){
		e.preventDefault();

		if(this.isLocked(e.target)){
			return;
		}

		this.dropTarget = {id: e.target.id, name: e.target.textContent};
		this.setPlaceHolder(this.dropTarget);
	},
	leave: function(e){
		this.removePlaceHolder();
		delete this.dropTarget;
	},
	setPlaceHolder: function(target){
		if(target.id != 'list-item-drop'){
			this.removePlaceHolder();
			this.addOn({id:target.id}, {id:'list-item-drop', name:'Drop Here!'});
		}
	},
	removePlaceHolder: function(){
		this.removeOn({id:'list-item-drop'});
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
					return this.updateLock(i);
				return this.updateLock(i+1);
			}
		}
	},
	isLocked: function(target){
		return target.classList.contains('locked');
	},
	render: function(){
        return (
        	<div className="list">
	        	<RB.ListGroup>
	        	{	
					this.state.list.map(function(listItem, index, array) {
						var locked = index<this.state.locked ? 'glyphicon glyphicon-lock locked' : '';
		                return (
		                	<RB.ListGroupItem className={"list-item "+locked} id={listItem.id} onDragStart={this.drag} onDrop={this.drop} onDragOver={this.over} onDragLeave={this.leave} onDoubleClick={this.toggleLock} draggable="true">
		                		{listItem.name}
		                	</RB.ListGroupItem>
		                )
		            },this)
	        	}
	        	<RB.ListGroupItem className="list-item-end" id="list-item-end" onDragOver={this.over}>END</RB.ListGroupItem>
	        	</RB.ListGroup>
        	</div>
        );
    }
});


//*******************************//
//*** My Main REact Component ***//
//*******************************//

var MyReactComponent = React.createClass({
	getInitialState: function() {
		var visible = [];
		
		for(i in this.props.visible){
			for(j in this.props.available){
				if(this.props.available[j]['id'] === this.props.visible[i])
					visible.push(this.props.available.splice(j,1)[0]);
			}
		}

		return {
			available: this.props.available,
			visible: visible,
			locked: this.props.locked,
		};
	},
    save: function() {
    	var ref = this.refs;
    	var data = { 'visible': ref.visible.getSimpleList(), 'locked': ref.visible.state.locked }
    	var event = new Event('save', {'detail': this});
    	event.data = data;
    	document.dispatchEvent(event);
    },
    close: function() {
        alert('Closing component');
    },
    render: function() {
        return (
            <div className="react-component">
                <span className="header">
                    <RB.Glyphicon glyph='remove' className="close-icon" bsSize="large" onClick={this.close}/>
                    <p className="head1">{this.props.title}</p>
        			<p className="head2">{this.props.details}</p>
                </span>
                
                <div className="content">
                	<div className="available">
                		<p className="head2">Available</p>
                		<MyListComponent ref="available" items={this.state.available}/>
                	</div>
                	
                	<div className="visible">
                		<p className="head2">Visible</p>
                		<MyListComponent ref="visible" lockEnabled={true} locked={this.state.locked} items={this.state.visible}/>
                		
                	</div>
                </div>
                
                <span className="footer">
                    <RB.ButtonToolbar className="button-toolbar">
						<RB.Button bsStyle='primary' onClick={this.save}>Save</RB.Button>
						<RB.Button onClick={this.close}>Cancel</RB.Button>
				    </RB.ButtonToolbar>
                </span>
            </div>
        );
    }
});


var availableItems = [
	{
		id: "item-start-time",
		name: "Start Time"
	},
	{
		id: "item-stop-time",
		name: "Stop Time"
	},
	{
		id: "item-per-point",
		name: "Per Point"
	},
	{
		id: "item-initial-margin",
		name: "Initial Margin"
	},
	{
		id: "item-symbol-and-description",
		name: "Symbol and Description"
	},
	{
		id: "item-change-percent",
		name: "Change %"
	},
	{
		id: "item-change",
		name: "Change"
	},
	{
		id: "item-last",
		name: "Last"
	},
	{
		id: "item-last-volume",
		name: "Last Volume"
	},
	{
		id: "item-bid",
		name: "Bid"
	},
	{
		id: "item-bid-size",
		name: "Bid Size"
	},
	{
		id: "item-ask",
		name: "Ask"
	},
	{
		id: "item-ask-size",
		name: "Ask Size"
	},
	{
		id: "item-total-volume",
		name: "Total Volume"
	},
	{
		id: "item-high",
		name: "High"
	},
	{
		id: "item-fun-factor",
		name: "Fun Factor"
	}
]

var visibleItems = [
	"item-symbol-and-description",
	"item-change-percent",
	"item-change",
	"item-last",
	"item-last-volume",
	"item-bid",
	"item-bid-size",
	"item-ask",
	"item-ask-size",
	"item-total-volume",
	"item-high",
	"item-fun-factor",
]

var fixed = 1;

document.addEventListener('save', function(e){
	console.log(e);
	alert('Triggered by "save" event.\n\nVisible: ' + e.data.visible.toString() + '\nFixed: ' + e.data.locked);
});

React.render(
	<MyReactComponent
		title="Configure Data Fields"
		details="Drag & drop between columns to configure visible data."
		available={availableItems}
		visible={visibleItems}
		locked={fixed}/>, 
	document.getElementById('react-container'));
