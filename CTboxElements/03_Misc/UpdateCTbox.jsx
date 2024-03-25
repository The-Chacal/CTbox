//****************************************//
//   CTbox Updater
//****************************************//

/**
 * Overwrites the current CTbox Files with the ones found in the Software Ressources Folder.
 */
function updateCTbox(){
    var scriptFolder = new Folder( "//peps/studioPEP/TEAM SHARE/Sylvain LORENT/ScriptsAE/CTbox" );
    var scriptFiles = scriptFolder.getFiles( "CTbox*" );
    var targetFolder = new Folder( Folder.userData.fsName + "/Adobe/After Effects/" + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels" );
    if( !targetFolder.exists){ targetFolder.create(); }
    for( var i = 0 ; i < scriptFiles.length ; i++ ){ copyFiles( scriptFiles[i] , targetFolder ); }
}
/**
 * Recursive function copying all the Files and Folder from a Folder.
 * @param { Object } item Item to Copy
 * @param { Folder Object } destination Folder to copy in.
 */
function copyFiles( item , destination ){
    if( item instanceof Folder ){
        var newFolder = new Folder( destination.fsName + "/" + item.name )
        newFolder.create()
        var folderFiles = item.getFiles();
        for( var i = 0 ; i < folderFiles.length ; i++ ){
            copyFiles( folderFiles[i] , newFolder );
        }
    } else {
        item.copy( destination.fsName + "\\" + item.name );
    }
}