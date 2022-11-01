import cluster from "cluster";

const instance = 2;
if (cluster.isPrimary) {
  for (let i = 0; i < instance; i++) {
    cluster.fork();
  }
} else {
  import("./index");
}
