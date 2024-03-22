build-prod:
	BUILD_VERSION=analyzer skaffold build
	BUILD_VERSION=analyzer skaffold render --output swiftanalyzerui-render.yaml
	

run-prod:
	docker run -it --rm -p 1231:80 registry.filcoin.xyz:8900/filexplorer/swiftanalyzerui:analyzer

install:
	BUILD_VERSION=analyzer skaffold build
	BUILD_VERSION=analyzer skaffold render --output swiftanalyzerui-render.yaml
	kubectl apply -f swiftanalyzerui-render.yaml

run:
	yarn build
	BUILD_VERSION=analyzer skaffold run
	