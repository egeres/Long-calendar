
import os

os.chdir(os.path.abspath(os.path.join(os.path.abspath(__file__), "..")))

os.system("python data_generator_activitywatch.py")
# os.system("python data_generator_fitness.py")
# os.system("python data_generator_anki.py")
# os.system("python data_generator_kindle.py")
# os.system("python data_generator_chats.py")
# os.system("python data_generator_sleep.py")

print ("Finished routine execution...")
