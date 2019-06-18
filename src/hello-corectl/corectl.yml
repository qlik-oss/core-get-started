engine: localhost:19076 # URL and port to running Qlik Associative Engine instance
app: /testscript.qvf   # App name that the tool should open a session against.
script: /testscript.qvs # Path to a script that should be set in the app
connections: # Connections that should be created in the app
  testdata:
      connectionstring: /data # Connectionstring (qConnectionString) of the connection. For a folder connector this is an absolute or relative path inside of the engine docker container.
      type: folder # Type of connection
objects:
  - ./hello-corectl.json # Path to objects that should be created from a json file. Accepts wildcards.
