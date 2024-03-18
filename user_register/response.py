from django.http import JsonResponse



def response(method, status, message, obj = None):
    response_data = {
        "method" : method,
        "status" : status,
        "message" : message,
    }


    if obj is not None:
        response_data['data'] = obj
    
    if(status == 'success'):
        return JsonResponse(response_data, status=200)
    
    if(status == 'unauthorized'):
        return JsonResponse(response_data, status=401)
    
    if(status == 'bad_request'):
        return JsonResponse(response_data, status=400)
    
    if(status == 'not_found'):
        return JsonResponse(response_data, status=404)
    
    if(status == 'user_not_found'):
        return JsonResponse(response_data, status=404)

    return JsonResponse(response_data)