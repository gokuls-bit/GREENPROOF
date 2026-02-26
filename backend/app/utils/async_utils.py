import asyncio

def run_async(func, *args, **kwargs):
    return asyncio.get_event_loop().run_in_executor(None, func, *args, **kwargs)
