from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
from django.template.exceptions import TemplateDoesNotExist

def index(request):
    try:
        template = loader.get_template('index.html')
        print(template)
    except TemplateDoesNotExist:
        return HttpResponse("The 'index.html' template does not exist.")
    else:
        return HttpResponse(template.render({}, request))