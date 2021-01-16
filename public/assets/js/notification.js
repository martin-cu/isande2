function addNotifToDropdown(arr) {
	var dropdown = $('#notifDropdownMenu :last');
	var elemClass1, elemClass2, href;
	var a, div1, div2, div3, iElem, span, p;
	
	for (var i = 0; i < arr.length; i++) {
		href = arr[i].url;
		if (arr[i].seen) {
			elemClass1 = 'seen';
			elemClass2 = 'text-gray-700';
		}
		else {
			elemClass1 = 'unseen';
			elemClass2 = 'font-weight-bold';
		}
		a = document.createElement('a');
		a.setAttribute('class', 'd-flex align-items-center dropdown-item border-top '+elemClass1);
		a.setAttribute('href', href);
		a.setAttribute('style', 'padding: .25rem 0.75rem !important;')

		div1 = document.createElement('div');
		div1.setAttribute('class', 'dropdown-list-image mr-3');
		iElem = document.createElement('i');
		iElem.setAttribute('class', 'fa fa-truck d-xl-flex justify-content-xl-center');
		iElem.setAttribute('style', 'font-size: 30px;');
		div1.appendChild(iElem);

		div2 = document.createElement('div');
		div2.setAttribute('class', elemClass2);
		div3 = document.createElement('div');
		span = document.createElement('span');
		span.innerHTML = arr[i].contents;

		p = document.createElement('p');
		p.setAttribute('class', 'small text-gray-500 mb-0');
		p.innerHTML = arr[i].role_id+' - '+arr[i].formattedDate;
		div3.appendChild(span);
		div2.appendChild(div3);
		div2.appendChild(p);

		a.appendChild(div1);
		a.appendChild(div2);

		dropdown.before(a);
	}
}

function getNotifs(data) {
	$.get('/getNotifs', { employee_id: data }, function(notifs) {
		$('#notifCount').remove();
		$('#notifDropdownMenu a').not(':last').remove();
		addNotifToDropdown(notifs.notifs);
		$.post('/seenNotifs', { employee_id: data }, function(update) {
			console.log(update);
		});
	});
}

function toggleNotifDropdown() {
	$('#notifToggle').toggleClass('show');
	$('#notifDropdownMenu').toggleClass('show');
	$('#notifDropdown').attr('aria-expanded', function(_, attr) {
		return !(attr == 'true');
	});
}

function hideNotifDropdown() {
	$('#notifToggle').removeClass('show');
	$('#notifDropdownMenu').removeClass('show');
	$('#notifDropdown').attr('aria-expanded', false);
}

$(document).ready(function() {
	$('#notifToggle').on('click', function() {
		toggleNotifDropdown();
		getNotifs(employee);
	});
	$(document).click(function(e) {
		if (e.target.id !== 'notifToggle' && e.target.id !== 'notifDropdown' && e.target.id !== 'notifIcon' && e.target.id !== 'notifCount')
			hideNotifDropdown();
	});
});